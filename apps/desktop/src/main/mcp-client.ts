/**
 * MCP Client — Spawns @next-dev/mcp-server as a child process
 *
 * The DesignForge MCP server lives at packages/mcp-server and exposes
 * design tools (add_element, update_props, generate, etc.) via stdio JSON-RPC.
 *
 * This module:
 * 1. Spawns the MCP server on app startup
 * 2. Communicates via JSON-RPC 2.0 over stdio
 * 3. Exposes all MCP tools to the renderer via IPC
 *
 * External agents (Claude Code, Cursor, etc.) can also connect to the
 * same MCP server independently by running `pnpm --filter @next-dev/mcp-server start`.
 */

import { spawn, type ChildProcess } from 'node:child_process';
import { ipcMain, app, BrowserWindow } from 'electron';
import { existsSync, watch as watchFs, type FSWatcher } from 'node:fs';
import { mkdir, readdir, readFile, unlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

// ─── Types ──────────────────────────────────────────────────────────────────

export interface MCPTool {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
}

interface JsonRpcResponse {
  jsonrpc: '2.0';
  id: number;
  result?: unknown;
  error?: { code: number; message: string; data?: unknown };
}

interface MCPChannelSnapshot {
  filePath: string | null;
  spec: unknown;
  selectedIds: string[];
  hoveredId: string | null;
  zoom: number;
  pan: [number, number];
}

interface LiveMutationOperation {
  type: 'add' | 'remove' | 'move' | 'updateProps' | 'duplicate' | 'group' | 'ungroup';
  parentId?: string;
  elementType?: string;
  props?: Record<string, unknown>;
  index?: number;
  elementId?: string;
  newParentId?: string;
  elementIds?: string[];
}

type LiveMutation =
  | { kind: 'applyOperations'; operations: LiveMutationOperation[] }
  | { kind: 'replaceSpec'; spec: unknown }
  | { kind: 'undo' }
  | { kind: 'redo' }
  | { kind: 'setSelection'; selectedIds: string[] };

interface LiveMutationRequest {
  requestId: string;
  channelId: string;
  mutation: LiveMutation;
}

interface LiveMutationResult {
  success: boolean;
  error?: string;
  context?: MCPChannelSnapshot;
}

interface ChildRpcRequest {
  kind: 'request';
  id: number;
  method: 'apply_live_mutation';
  params: LiveMutationRequest;
}

interface ChildRpcResponse {
  kind: 'response';
  id: number;
  result?: unknown;
  error?: string;
}

const DEFAULT_DESKTOP_CHANNEL_ID = 'designforge-desktop-main';
const CHANNEL_ROOT_DIR = join(tmpdir(), 'designforge-mcp', 'channels');
const CHANNEL_REQUESTS_ROOT_DIR = join(CHANNEL_ROOT_DIR, 'requests');
const CHANNEL_RESPONSES_ROOT_DIR = join(CHANNEL_ROOT_DIR, 'responses');

function getChannelFilePath(channelId: string): string {
  return join(CHANNEL_ROOT_DIR, `${encodeURIComponent(channelId)}.json`);
}

function getChannelRequestsDir(channelId: string): string {
  return join(CHANNEL_REQUESTS_ROOT_DIR, encodeURIComponent(channelId));
}

function getChannelResponsesDir(channelId: string): string {
  return join(CHANNEL_RESPONSES_ROOT_DIR, encodeURIComponent(channelId));
}

// ─── MCP Connection ─────────────────────────────────────────────────────────

class MCPConnection {
  private process: ChildProcess | null = null;
  private nextId = 1;
  private pending = new Map<number, {
    resolve: (value: unknown) => void;
    reject: (error: Error) => void;
    timer: ReturnType<typeof setTimeout>;
  }>();
  private buffer = '';
  private _tools: MCPTool[] = [];
  private _connected = false;
  private _serverPath: string;
  private _channelId = DEFAULT_DESKTOP_CHANNEL_ID;
  private externalMutationWatcher: FSWatcher | null = null;
  private externalMutationProcessing = new Set<string>();
  private pendingMutationResults = new Map<string, {
    resolve: (value: LiveMutationResult) => void;
    reject: (error: Error) => void;
    timer: ReturnType<typeof setTimeout>;
  }>();

  constructor() {
    // Resolve the MCP server path relative to the app
    const isDev = !app.isPackaged;
    if (isDev) {
      // In dev: packages/mcp-server is relative to the monorepo root
      // The desktop app is at apps/desktop, so go up 2 levels
      this._serverPath = join(__dirname, '..', '..', '..', '..', 'packages', 'mcp-server');
    } else {
      // In production: bundled alongside the app
      this._serverPath = join(app.getAppPath(), '..', 'mcp-server');
    }
    console.log('[MCP] Server path:', this._serverPath);
  }

  get connected(): boolean {
    return this._connected;
  }

  get tools(): MCPTool[] {
    return this._tools;
  }

  get serverPath(): string {
    return this._serverPath;
  }

  get channelId(): string {
    return this._channelId;
  }

  get channelFilePath(): string {
    return getChannelFilePath(this._channelId);
  }

  async connect(): Promise<void> {
    if (this._connected) return;

    // Check if the server exists
    const serverEntry = join(this._serverPath, 'src', 'index.ts');
    if (!existsSync(serverEntry)) {
      console.error(`[MCP] Server not found at ${serverEntry}`);
      throw new Error(`MCP server not found at ${serverEntry}. Make sure packages/mcp-server exists.`);
    }

    return new Promise<void>((resolve, reject) => {
      console.log('[MCP] Spawning DesignForge MCP server...');

      // Use the current Electron binary in Node mode so we get a dedicated IPC
      // channel back from the MCP child process.
      // The channel args let the server inspect the current live desktop context.
      this.process = spawn(process.execPath, [
        '--import',
        'tsx/esm',
        serverEntry,
        '--channel',
        this._channelId,
        '--channel-dir',
        CHANNEL_ROOT_DIR,
      ], {
        stdio: ['pipe', 'pipe', 'pipe', 'ipc'],
        env: {
          ...process.env,
          ELECTRON_RUN_AS_NODE: '1',
        },
        windowsHide: true,
        cwd: this._serverPath,
      });

      this.process.stdout!.on('data', (data: Buffer) => {
        this.handleData(data.toString());
      });

      this.process.stderr!.on('data', (data: Buffer) => {
        const msg = data.toString().trim();
        if (msg) console.log('[MCP Server]', msg);
      });

      this.process.on('message', (message) => {
        this.handleChildRpcMessage(message);
      });

      this.process.on('error', (err) => {
        console.error('[MCP] Process error:', err);
        this._connected = false;
        reject(err);
      });

      this.process.on('close', (code) => {
        console.log(`[MCP] Server exited with code ${code}`);
        this._connected = false;
        this.cleanup();
      });

      // Initialize the connection with MCP protocol handshake
      this.initialize().then(() => {
        this._connected = true;
        this.ensureExternalMutationBridge().then(() => {
          console.log('[MCP] DesignForge MCP server connected!');
          resolve();
        }).catch(reject);
      }).catch(reject);
    });
  }

  private async initialize(): Promise<void> {
    const initResult = await this.sendRequest('initialize', {
      protocolVersion: '2024-11-05',
      capabilities: {},
      clientInfo: {
        name: 'DesignForge Desktop',
        version: '0.1.0',
      },
    }) as Record<string, unknown>;

    console.log('[MCP] Initialized. Server capabilities:',
      JSON.stringify(initResult?.capabilities ?? {}));

    // Send initialized notification
    this.sendNotification('notifications/initialized', {});

    // Discover tools
    await this.refreshTools();
  }

  async refreshTools(): Promise<MCPTool[]> {
    try {
      const result = await this.sendRequest('tools/list', {}) as { tools: MCPTool[] };
      this._tools = (result?.tools ?? []).map((t) => ({
        name: t.name,
        description: t.description ?? '',
        inputSchema: t.inputSchema ?? {},
      }));
      console.log(`[MCP] Discovered ${this._tools.length} tools:`,
        this._tools.map((t) => t.name));
    } catch (err) {
      console.error('[MCP] Failed to list tools:', err);
      this._tools = [];
    }
    return this._tools;
  }

  async callTool(toolName: string, args: Record<string, unknown>): Promise<unknown> {
    if (!this._connected) {
      throw new Error('MCP server not connected');
    }
    console.log(`[MCP] Calling tool: ${toolName}`, args);
    const result = await this.sendRequest('tools/call', {
      name: toolName,
      arguments: args,
    });
    return result;
  }

  async publishContext(snapshot: MCPChannelSnapshot): Promise<string> {
    await mkdir(CHANNEL_ROOT_DIR, { recursive: true });
    const payload = {
      channelId: this._channelId,
      updatedAt: new Date().toISOString(),
      ...snapshot,
    };

    await writeFile(this.channelFilePath, JSON.stringify(payload, null, 2), 'utf-8');
    return this.channelFilePath;
  }

  async clearPublishedContext(): Promise<void> {
    if (!existsSync(this.channelFilePath)) return;
    await unlink(this.channelFilePath);
  }

  private async ensureExternalMutationBridge(): Promise<void> {
    const requestsDir = getChannelRequestsDir(this._channelId);
    const responsesDir = getChannelResponsesDir(this._channelId);
    await mkdir(requestsDir, { recursive: true });
    await mkdir(responsesDir, { recursive: true });

    if (!this.externalMutationWatcher) {
      this.externalMutationWatcher = watchFs(requestsDir, (_eventType, filename) => {
        if (!filename || !filename.toString().endsWith('.json')) return;
        void this.processExternalMutationRequests();
      });
    }

    await this.processExternalMutationRequests();
  }

  private async processExternalMutationRequests(): Promise<void> {
    const requestsDir = getChannelRequestsDir(this._channelId);
    const responsesDir = getChannelResponsesDir(this._channelId);

    let entries: string[] = [];
    try {
      entries = await readdir(requestsDir);
    } catch {
      return;
    }

    for (const entry of entries) {
      if (!entry.endsWith('.json') || this.externalMutationProcessing.has(entry)) continue;

      this.externalMutationProcessing.add(entry);
      void this.processExternalMutationRequest(
        join(requestsDir, entry),
        join(responsesDir, entry),
        entry,
      );
    }
  }

  private async processExternalMutationRequest(
    requestPath: string,
    responsePath: string,
    entry: string,
  ): Promise<void> {
    try {
      const content = await readFile(requestPath, 'utf-8');
      const request = JSON.parse(content) as LiveMutationRequest;
      const result = await this.requestRendererMutation(request);
      await writeFile(responsePath, JSON.stringify(result, null, 2), 'utf-8');
    } catch (error) {
      await writeFile(responsePath, JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : String(error),
      }, null, 2), 'utf-8').catch(() => {});
    } finally {
      await unlink(requestPath).catch(() => {});
      this.externalMutationProcessing.delete(entry);
    }
  }

  private closeExternalMutationBridge(): void {
    if (this.externalMutationWatcher) {
      this.externalMutationWatcher.close();
      this.externalMutationWatcher = null;
    }
    this.externalMutationProcessing.clear();
  }

  async requestRendererMutation(request: LiveMutationRequest): Promise<LiveMutationResult> {
    const mainWindow = BrowserWindow.getAllWindows()[0];
    if (!mainWindow) {
      return { success: false, error: 'No DesignForge desktop window is available.' };
    }

    return new Promise<LiveMutationResult>((resolve, reject) => {
      const timer = setTimeout(() => {
        this.pendingMutationResults.delete(request.requestId);
        reject(new Error(`Live mutation '${request.requestId}' timed out (30s)`));
      }, 30000);

      this.pendingMutationResults.set(request.requestId, { resolve, reject, timer });
      mainWindow.webContents.send('mcp:apply-live-mutation', request);
    });
  }

  resolveRendererMutation(
    requestId: string,
    result: LiveMutationResult,
  ): void {
    const pending = this.pendingMutationResults.get(requestId);
    if (!pending) return;

    this.pendingMutationResults.delete(requestId);
    clearTimeout(pending.timer);
    pending.resolve(result);
  }

  private sendRequest(method: string, params: Record<string, unknown>): Promise<unknown> {
    return new Promise((resolve, reject) => {
      const id = this.nextId++;
      const request = {
        jsonrpc: '2.0',
        id,
        method,
        params,
      };

      const timer = setTimeout(() => {
        this.pending.delete(id);
        reject(new Error(`MCP request '${method}' timed out (30s)`));
      }, 30000);

      this.pending.set(id, { resolve, reject, timer });

      if (!this.process?.stdin?.writable) {
        this.pending.delete(id);
        clearTimeout(timer);
        reject(new Error('MCP server stdin not writable'));
        return;
      }

      this.process.stdin.write(`${JSON.stringify(request)}\n`);
    });
  }

  private sendNotification(method: string, params: Record<string, unknown>): void {
    this.process?.stdin?.write(`${JSON.stringify({ jsonrpc: '2.0', method, params })}\n`);
  }

  private handleData(data: string): void {
    this.buffer += data;

    while (true) {
      const lineEnd = this.buffer.indexOf('\n');
      if (lineEnd === -1) break;

      const messageStr = this.buffer.slice(0, lineEnd).replace(/\r$/, '');
      this.buffer = this.buffer.slice(lineEnd + 1);
      if (!messageStr.trim()) continue;

      try {
        const message = JSON.parse(messageStr) as JsonRpcResponse;
        this.handleMessage(message);
      } catch (err) {
        console.error('[MCP] Failed to parse message:', err);
      }
    }
  }

  private handleMessage(message: JsonRpcResponse): void {
    if (message.id !== undefined && this.pending.has(message.id)) {
      const handler = this.pending.get(message.id)!;
      this.pending.delete(message.id);
      clearTimeout(handler.timer);

      if (message.error) {
        handler.reject(new Error(message.error.message));
      } else {
        handler.resolve(message.result);
      }
    }
  }

  private handleChildRpcMessage(message: unknown): void {
    if (typeof message !== 'object' || message === null) return;

    const rpc = message as Partial<ChildRpcRequest>;
    if (rpc.kind !== 'request' || typeof rpc.id !== 'number' || typeof rpc.method !== 'string') {
      return;
    }

    void this.handleChildRpcRequest(rpc as ChildRpcRequest);
  }

  private async handleChildRpcRequest(request: ChildRpcRequest): Promise<void> {
    try {
      switch (request.method) {
        case 'apply_live_mutation': {
          const result = await this.requestRendererMutation(request.params);
          this.sendChildRpcResponse({ kind: 'response', id: request.id, result });
          return;
        }
        default:
          this.sendChildRpcResponse({
            kind: 'response',
            id: request.id,
            error: `Unsupported child RPC method: ${request.method}`,
          });
      }
    } catch (error) {
      this.sendChildRpcResponse({
        kind: 'response',
        id: request.id,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  private sendChildRpcResponse(response: ChildRpcResponse): void {
    if (!this.process?.connected || typeof this.process.send !== 'function') return;
    this.process.send(response);
  }

  async disconnect(): Promise<void> {
    this._connected = false;
    this.cleanup();
    this.closeExternalMutationBridge();

    if (this.process) {
      this.process.kill();
      this.process = null;
    }
  }

  private cleanup(): void {
    for (const [, handler] of this.pending) {
      clearTimeout(handler.timer);
      handler.reject(new Error('Connection closed'));
    }
    this.pending.clear();

    for (const [, handler] of this.pendingMutationResults) {
      clearTimeout(handler.timer);
      handler.reject(new Error('Connection closed'));
    }
    this.pendingMutationResults.clear();
  }
}

// ─── Singleton + IPC Setup ──────────────────────────────────────────────────

const mcpConnection = new MCPConnection();

export function setupMCPIPC(): void {
  console.log('[MCP] Setting up IPC handlers...');

  // Auto-connect to the DesignForge MCP server
  ipcMain.handle('mcp:connect', async () => {
    try {
      await mcpConnection.connect();
      return { success: true, tools: mcpConnection.tools };
    } catch (err) {
      console.error('[MCP] Connect failed:', err);
      return { success: false, error: (err as Error).message };
    }
  });

  // Disconnect
  ipcMain.handle('mcp:disconnect', async () => {
    await mcpConnection.disconnect();
    return { success: true };
  });

  // Get connection status
  ipcMain.handle('mcp:status', () => {
    return {
      connected: mcpConnection.connected,
      serverPath: mcpConnection.serverPath,
      tools: mcpConnection.tools,
      channelId: mcpConnection.channelId,
      channelFilePath: mcpConnection.channelFilePath,
    };
  });

  // List all available tools
  ipcMain.handle('mcp:list-tools', async () => {
    return mcpConnection.tools;
  });

  // Call a tool by name
  ipcMain.handle('mcp:call', async (
    _event,
    toolName: string,
    args: Record<string, unknown>,
  ) => {
    try {
      const result = await mcpConnection.callTool(toolName, args);
      return { success: true, result };
    } catch (err) {
      return { success: false, error: (err as Error).message };
    }
  });

  ipcMain.handle('mcp:publish-context', async (
    _event,
    snapshot: MCPChannelSnapshot,
  ) => {
    try {
      const channelFilePath = await mcpConnection.publishContext(snapshot);
      return {
        success: true,
        channelId: mcpConnection.channelId,
        channelFilePath,
      };
    } catch (err) {
      return { success: false, error: (err as Error).message };
    }
  });

  ipcMain.handle('mcp:mutation-result', async (
    _event,
    requestId: string,
    result: LiveMutationResult,
  ) => {
    mcpConnection.resolveRendererMutation(requestId, result);
    return { success: true };
  });

  // Auto-connect on startup
  mcpConnection.connect().then(() => {
    console.log('[MCP] Auto-connected to DesignForge MCP server');
  }).catch((err) => {
    console.warn('[MCP] Auto-connect failed (will retry on user action):', err.message);
  });

  // Disconnect all on app quit
  app.on('before-quit', () => {
    void mcpConnection.clearPublishedContext();
    mcpConnection.disconnect();
  });
}
