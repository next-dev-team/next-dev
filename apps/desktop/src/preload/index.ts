/**
 * DesignForge Desktop — Preload Script
 *
 * Bridges Electron main process ↔ renderer process.
 * Uses contextBridge to safely expose IPC calls as the `designforge` API.
 */

import { contextBridge, ipcRenderer } from 'electron';

export interface DesignForgeAPI {
  fs: {
    read(path: string): Promise<string>;
    write(path: string, content: string): Promise<void>;
    pick(filters?: string[]): Promise<string | null>;
    pickDirectory(): Promise<string | null>;
    saveDialog(): Promise<string | null>;
    writeBatch(basePath: string, files: Array<{ path: string; content: string }>): Promise<void>;
  };
  theme: {
    get(): Promise<'light' | 'dark'>;
    onChange(cb: (theme: 'light' | 'dark') => void): () => void;
  };
  shell: {
    open(url: string): void;
  };
  window: {
    minimize(): void;
    maximize(): void;
    close(): void;
  };
  app: {
    version(): Promise<string>;
    name(): Promise<string>;
  };
  mcp: {
    /** Connect to the DesignForge MCP server */
    connect(): Promise<{ success: boolean; error?: string; tools?: Array<{ name: string; description: string }> }>;
    /** Disconnect from the MCP server */
    disconnect(): Promise<{ success: boolean }>;
    /** Get connection status */
    status(): Promise<{
      connected: boolean;
      serverPath: string;
      tools: Array<{ name: string; description: string }>;
      channelId: string;
      channelFilePath: string;
    }>;
    /** List available MCP tools */
    listTools(): Promise<Array<{ name: string; description: string; inputSchema: Record<string, unknown> }>>;
    /** Call an MCP tool by name */
    call(toolName: string, args: Record<string, unknown>): Promise<{ success: boolean; result?: unknown; error?: string }>;
    /** Publish the current live desktop context for joined MCP clients */
    publishContext(snapshot: {
      filePath: string | null;
      spec: unknown;
      selectedIds: string[];
      hoveredId: string | null;
      zoom: number;
      pan: [number, number];
    }): Promise<{ success: boolean; channelId?: string; channelFilePath?: string; error?: string }>;
    /** Listen for live mutation requests coming from the spawned MCP server */
    onApplyLiveMutation(cb: (request: {
      requestId: string;
      channelId: string;
      mutation: unknown;
    }) => void): () => void;
    /** Acknowledge a live mutation request after the renderer applies it */
    respondMutationResult(
      requestId: string,
      result: { success: boolean; error?: string; context?: unknown },
    ): Promise<{ success: boolean }>;
  };
  watch: {
    /** Start watching a .dfg file for live MCP changes */
    start(filePath: string): Promise<{ success: boolean; error?: string }>;
    /** Stop watching */
    stop(): Promise<{ success: boolean }>;
    /** Get watch status */
    status(): Promise<{ watching: boolean; path: string | null }>;
    /** Listen for spec changes from the watched file */
    onSpecChanged(cb: (spec: unknown) => void): () => void;
  };
}

const api: DesignForgeAPI = {
  fs: {
    read: (path: string) => ipcRenderer.invoke('fs:read', path),
    write: (path: string, content: string) => ipcRenderer.invoke('fs:write', path, content),
    pick: (filters?: string[]) => ipcRenderer.invoke('fs:pick', filters),
    pickDirectory: () => ipcRenderer.invoke('fs:pick-directory'),
    saveDialog: () => ipcRenderer.invoke('fs:save-dialog'),
    writeBatch: (basePath: string, files: Array<{ path: string; content: string }>) =>
      ipcRenderer.invoke('fs:write-batch', basePath, files),
  },
  theme: {
    get: () => ipcRenderer.invoke('theme:get'),
    onChange: (cb: (theme: 'light' | 'dark') => void) => {
      const handler = (_event: Electron.IpcRendererEvent, theme: 'light' | 'dark') => cb(theme);
      ipcRenderer.on('theme:changed', handler);
      return () => {
        ipcRenderer.removeListener('theme:changed', handler);
      };
    },
  },
  shell: {
    open: (url: string) => ipcRenderer.invoke('shell:open', url),
  },
  window: {
    minimize: () => ipcRenderer.invoke('window:minimize'),
    maximize: () => ipcRenderer.invoke('window:maximize'),
    close: () => ipcRenderer.invoke('window:close'),
  },
  app: {
    version: () => ipcRenderer.invoke('app:version'),
    name: () => ipcRenderer.invoke('app:name'),
  },
  mcp: {
    connect: () => ipcRenderer.invoke('mcp:connect'),
    disconnect: () => ipcRenderer.invoke('mcp:disconnect'),
    status: () => ipcRenderer.invoke('mcp:status'),
    listTools: () => ipcRenderer.invoke('mcp:list-tools'),
    call: (toolName: string, args: Record<string, unknown>) =>
      ipcRenderer.invoke('mcp:call', toolName, args),
    publishContext: (snapshot) => ipcRenderer.invoke('mcp:publish-context', snapshot),
    onApplyLiveMutation: (cb) => {
      const handler = (_event: Electron.IpcRendererEvent, request: {
        requestId: string;
        channelId: string;
        mutation: unknown;
      }) => cb(request);
      ipcRenderer.on('mcp:apply-live-mutation', handler);
      return () => {
        ipcRenderer.removeListener('mcp:apply-live-mutation', handler);
      };
    },
    respondMutationResult: (requestId, result) =>
      ipcRenderer.invoke('mcp:mutation-result', requestId, result),
  },
  watch: {
    start: (filePath: string) => ipcRenderer.invoke('watch:start', filePath),
    stop: () => ipcRenderer.invoke('watch:stop'),
    status: () => ipcRenderer.invoke('watch:status'),
    onSpecChanged: (cb: (spec: unknown) => void) => {
      const handler = (_event: Electron.IpcRendererEvent, spec: unknown) => cb(spec);
      ipcRenderer.on('watch:spec-changed', handler);
      return () => {
        ipcRenderer.removeListener('watch:spec-changed', handler);
      };
    },
  },
};

contextBridge.exposeInMainWorld('designforge', api);
