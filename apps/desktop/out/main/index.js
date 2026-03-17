import { app, BrowserWindow, ipcMain, nativeTheme, dialog, shell } from "electron";
import { join } from "node:path";
import { mkdir, writeFile, unlink, readFile } from "node:fs/promises";
import { existsSync, watch } from "node:fs";
import { is } from "@electron-toolkit/utils";
import { spawn } from "node:child_process";
import { tmpdir } from "node:os";
import __cjs_mod__ from "node:module";
const __filename = import.meta.filename;
const __dirname = import.meta.dirname;
const require2 = __cjs_mod__.createRequire(import.meta.url);
const DEFAULT_DESKTOP_CHANNEL_ID = "designforge-desktop-main";
const CHANNEL_ROOT_DIR = join(tmpdir(), "designforge-mcp", "channels");
function getChannelFilePath(channelId) {
  return join(CHANNEL_ROOT_DIR, `${encodeURIComponent(channelId)}.json`);
}
class MCPConnection {
  process = null;
  nextId = 1;
  pending = /* @__PURE__ */ new Map();
  buffer = "";
  _tools = [];
  _connected = false;
  _serverPath;
  _channelId = DEFAULT_DESKTOP_CHANNEL_ID;
  pendingMutationResults = /* @__PURE__ */ new Map();
  constructor() {
    const isDev = !app.isPackaged;
    if (isDev) {
      this._serverPath = join(__dirname, "..", "..", "..", "..", "packages", "mcp-server");
    } else {
      this._serverPath = join(app.getAppPath(), "..", "mcp-server");
    }
    console.log("[MCP] Server path:", this._serverPath);
  }
  get connected() {
    return this._connected;
  }
  get tools() {
    return this._tools;
  }
  get serverPath() {
    return this._serverPath;
  }
  get channelId() {
    return this._channelId;
  }
  get channelFilePath() {
    return getChannelFilePath(this._channelId);
  }
  async connect() {
    if (this._connected) return;
    const serverEntry = join(this._serverPath, "src", "index.ts");
    if (!existsSync(serverEntry)) {
      console.error(`[MCP] Server not found at ${serverEntry}`);
      throw new Error(`MCP server not found at ${serverEntry}. Make sure packages/mcp-server exists.`);
    }
    return new Promise((resolve, reject) => {
      console.log("[MCP] Spawning DesignForge MCP server...");
      this.process = spawn(process.execPath, [
        "--import",
        "tsx/esm",
        serverEntry,
        "--channel",
        this._channelId,
        "--channel-dir",
        CHANNEL_ROOT_DIR
      ], {
        stdio: ["pipe", "pipe", "pipe", "ipc"],
        env: {
          ...process.env,
          ELECTRON_RUN_AS_NODE: "1"
        },
        windowsHide: true,
        cwd: this._serverPath
      });
      this.process.stdout.on("data", (data) => {
        this.handleData(data.toString());
      });
      this.process.stderr.on("data", (data) => {
        const msg = data.toString().trim();
        if (msg) console.log("[MCP Server]", msg);
      });
      this.process.on("message", (message) => {
        this.handleChildRpcMessage(message);
      });
      this.process.on("error", (err) => {
        console.error("[MCP] Process error:", err);
        this._connected = false;
        reject(err);
      });
      this.process.on("close", (code) => {
        console.log(`[MCP] Server exited with code ${code}`);
        this._connected = false;
        this.cleanup();
      });
      this.initialize().then(() => {
        this._connected = true;
        console.log("[MCP] DesignForge MCP server connected!");
        resolve();
      }).catch(reject);
    });
  }
  async initialize() {
    const initResult = await this.sendRequest("initialize", {
      protocolVersion: "2024-11-05",
      capabilities: {},
      clientInfo: {
        name: "DesignForge Desktop",
        version: "0.1.0"
      }
    });
    console.log(
      "[MCP] Initialized. Server capabilities:",
      JSON.stringify(initResult?.capabilities ?? {})
    );
    this.sendNotification("notifications/initialized", {});
    await this.refreshTools();
  }
  async refreshTools() {
    try {
      const result = await this.sendRequest("tools/list", {});
      this._tools = (result?.tools ?? []).map((t) => ({
        name: t.name,
        description: t.description ?? "",
        inputSchema: t.inputSchema ?? {}
      }));
      console.log(
        `[MCP] Discovered ${this._tools.length} tools:`,
        this._tools.map((t) => t.name)
      );
    } catch (err) {
      console.error("[MCP] Failed to list tools:", err);
      this._tools = [];
    }
    return this._tools;
  }
  async callTool(toolName, args) {
    if (!this._connected) {
      throw new Error("MCP server not connected");
    }
    console.log(`[MCP] Calling tool: ${toolName}`, args);
    const result = await this.sendRequest("tools/call", {
      name: toolName,
      arguments: args
    });
    return result;
  }
  async publishContext(snapshot) {
    await mkdir(CHANNEL_ROOT_DIR, { recursive: true });
    const payload = {
      channelId: this._channelId,
      updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
      ...snapshot
    };
    await writeFile(this.channelFilePath, JSON.stringify(payload, null, 2), "utf-8");
    return this.channelFilePath;
  }
  async clearPublishedContext() {
    if (!existsSync(this.channelFilePath)) return;
    await unlink(this.channelFilePath);
  }
  async requestRendererMutation(request) {
    const mainWindow2 = BrowserWindow.getAllWindows()[0];
    if (!mainWindow2) {
      return { success: false, error: "No DesignForge desktop window is available." };
    }
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        this.pendingMutationResults.delete(request.requestId);
        reject(new Error(`Live mutation '${request.requestId}' timed out (30s)`));
      }, 3e4);
      this.pendingMutationResults.set(request.requestId, { resolve, reject, timer });
      mainWindow2.webContents.send("mcp:apply-live-mutation", request);
    });
  }
  resolveRendererMutation(requestId, result) {
    const pending = this.pendingMutationResults.get(requestId);
    if (!pending) return;
    this.pendingMutationResults.delete(requestId);
    clearTimeout(pending.timer);
    pending.resolve(result);
  }
  sendRequest(method, params) {
    return new Promise((resolve, reject) => {
      const id = this.nextId++;
      const request = {
        jsonrpc: "2.0",
        id,
        method,
        params
      };
      const timer = setTimeout(() => {
        this.pending.delete(id);
        reject(new Error(`MCP request '${method}' timed out (30s)`));
      }, 3e4);
      this.pending.set(id, { resolve, reject, timer });
      const msg = JSON.stringify(request);
      const payload = `Content-Length: ${Buffer.byteLength(msg)}\r
\r
${msg}`;
      if (!this.process?.stdin?.writable) {
        this.pending.delete(id);
        clearTimeout(timer);
        reject(new Error("MCP server stdin not writable"));
        return;
      }
      this.process.stdin.write(payload);
    });
  }
  sendNotification(method, params) {
    const msg = JSON.stringify({ jsonrpc: "2.0", method, params });
    const payload = `Content-Length: ${Buffer.byteLength(msg)}\r
\r
${msg}`;
    this.process?.stdin?.write(payload);
  }
  handleData(data) {
    this.buffer += data;
    while (true) {
      const headerEnd = this.buffer.indexOf("\r\n\r\n");
      if (headerEnd === -1) break;
      const header = this.buffer.slice(0, headerEnd);
      const match = header.match(/Content-Length:\s*(\d+)/i);
      if (!match) {
        this.buffer = this.buffer.slice(headerEnd + 4);
        continue;
      }
      const contentLength = Number.parseInt(match[1], 10);
      const messageStart = headerEnd + 4;
      const messageEnd = messageStart + contentLength;
      if (this.buffer.length < messageEnd) break;
      const messageStr = this.buffer.slice(messageStart, messageEnd);
      this.buffer = this.buffer.slice(messageEnd);
      try {
        const message = JSON.parse(messageStr);
        this.handleMessage(message);
      } catch (err) {
        console.error("[MCP] Failed to parse message:", err);
      }
    }
  }
  handleMessage(message) {
    if (message.id !== void 0 && this.pending.has(message.id)) {
      const handler = this.pending.get(message.id);
      this.pending.delete(message.id);
      clearTimeout(handler.timer);
      if (message.error) {
        handler.reject(new Error(message.error.message));
      } else {
        handler.resolve(message.result);
      }
    }
  }
  handleChildRpcMessage(message) {
    if (typeof message !== "object" || message === null) return;
    const rpc = message;
    if (rpc.kind !== "request" || typeof rpc.id !== "number" || typeof rpc.method !== "string") {
      return;
    }
    void this.handleChildRpcRequest(rpc);
  }
  async handleChildRpcRequest(request) {
    try {
      switch (request.method) {
        case "apply_live_mutation": {
          const result = await this.requestRendererMutation(request.params);
          this.sendChildRpcResponse({ kind: "response", id: request.id, result });
          return;
        }
        default:
          this.sendChildRpcResponse({
            kind: "response",
            id: request.id,
            error: `Unsupported child RPC method: ${request.method}`
          });
      }
    } catch (error) {
      this.sendChildRpcResponse({
        kind: "response",
        id: request.id,
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }
  sendChildRpcResponse(response) {
    if (!this.process?.connected || typeof this.process.send !== "function") return;
    this.process.send(response);
  }
  async disconnect() {
    this._connected = false;
    this.cleanup();
    if (this.process) {
      this.process.kill();
      this.process = null;
    }
  }
  cleanup() {
    for (const [, handler] of this.pending) {
      clearTimeout(handler.timer);
      handler.reject(new Error("Connection closed"));
    }
    this.pending.clear();
    for (const [, handler] of this.pendingMutationResults) {
      clearTimeout(handler.timer);
      handler.reject(new Error("Connection closed"));
    }
    this.pendingMutationResults.clear();
  }
}
const mcpConnection = new MCPConnection();
function setupMCPIPC() {
  console.log("[MCP] Setting up IPC handlers...");
  ipcMain.handle("mcp:connect", async () => {
    try {
      await mcpConnection.connect();
      return { success: true, tools: mcpConnection.tools };
    } catch (err) {
      console.error("[MCP] Connect failed:", err);
      return { success: false, error: err.message };
    }
  });
  ipcMain.handle("mcp:disconnect", async () => {
    await mcpConnection.disconnect();
    return { success: true };
  });
  ipcMain.handle("mcp:status", () => {
    return {
      connected: mcpConnection.connected,
      serverPath: mcpConnection.serverPath,
      tools: mcpConnection.tools,
      channelId: mcpConnection.channelId,
      channelFilePath: mcpConnection.channelFilePath
    };
  });
  ipcMain.handle("mcp:list-tools", async () => {
    return mcpConnection.tools;
  });
  ipcMain.handle("mcp:call", async (_event, toolName, args) => {
    try {
      const result = await mcpConnection.callTool(toolName, args);
      return { success: true, result };
    } catch (err) {
      return { success: false, error: err.message };
    }
  });
  ipcMain.handle("mcp:publish-context", async (_event, snapshot) => {
    try {
      const channelFilePath = await mcpConnection.publishContext(snapshot);
      return {
        success: true,
        channelId: mcpConnection.channelId,
        channelFilePath
      };
    } catch (err) {
      return { success: false, error: err.message };
    }
  });
  ipcMain.handle("mcp:mutation-result", async (_event, requestId, result) => {
    mcpConnection.resolveRendererMutation(requestId, result);
    return { success: true };
  });
  mcpConnection.connect().then(() => {
    console.log("[MCP] Auto-connected to DesignForge MCP server");
  }).catch((err) => {
    console.warn("[MCP] Auto-connect failed (will retry on user action):", err.message);
  });
  app.on("before-quit", () => {
    void mcpConnection.clearPublishedContext();
    mcpConnection.disconnect();
  });
}
let mainWindow = null;
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 1024,
    minHeight: 600,
    title: "DesignForge",
    backgroundColor: "#1a1a2e",
    titleBarStyle: process.platform === "darwin" ? "hiddenInset" : "default",
    trafficLightPosition: { x: 16, y: 16 },
    webPreferences: {
      preload: join(__dirname, "../preload/index.mjs"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false
    },
    show: false
  });
  mainWindow.on("ready-to-show", () => {
    mainWindow?.show();
    mainWindow?.focus();
  });
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: "deny" };
  });
  if (is.dev && process.env.ELECTRON_RENDERER_URL) {
    mainWindow.loadURL(process.env.ELECTRON_RENDERER_URL);
  } else {
    mainWindow.loadFile(join(__dirname, "../renderer/index.html"));
  }
}
function setupIPC() {
  ipcMain.handle("fs:read", async (_event, path) => {
    return readFile(path, "utf-8");
  });
  ipcMain.handle("fs:write", async (_event, path, content) => {
    await writeFile(path, content, "utf-8");
  });
  ipcMain.handle("fs:pick", async (_event, filters) => {
    const result = await dialog.showOpenDialog(mainWindow, {
      filters: filters?.length ? [{ name: "DesignForge", extensions: filters }] : [
        { name: "DesignForge Files", extensions: ["dfg"] },
        { name: "JSON Files", extensions: ["json"] },
        { name: "All Files", extensions: ["*"] }
      ],
      properties: ["openFile"]
    });
    return result.canceled ? null : result.filePaths[0];
  });
  ipcMain.handle("fs:save-dialog", async (_event) => {
    const result = await dialog.showSaveDialog(mainWindow, {
      filters: [
        { name: "DesignForge Files", extensions: ["dfg"] },
        { name: "JSON Files", extensions: ["json"] }
      ]
    });
    return result.canceled ? null : result.filePath;
  });
  ipcMain.handle("theme:get", () => {
    return nativeTheme.shouldUseDarkColors ? "dark" : "light";
  });
  ipcMain.handle("shell:open", (_event, url) => {
    shell.openExternal(url);
  });
  ipcMain.handle("window:minimize", () => mainWindow?.minimize());
  ipcMain.handle("window:maximize", () => {
    if (mainWindow?.isMaximized()) {
      mainWindow.unmaximize();
    } else {
      mainWindow?.maximize();
    }
  });
  ipcMain.handle("window:close", () => mainWindow?.close());
  ipcMain.handle("app:version", () => app.getVersion());
  ipcMain.handle("app:name", () => app.getName());
  let fileWatcher = null;
  let watchedPath = null;
  ipcMain.handle("watch:start", async (_event, filePath) => {
    if (fileWatcher) {
      fileWatcher.close();
      fileWatcher = null;
    }
    watchedPath = filePath;
    let debounceTimer = null;
    try {
      fileWatcher = watch(filePath, (_eventType) => {
        if (debounceTimer) clearTimeout(debounceTimer);
        debounceTimer = setTimeout(async () => {
          try {
            const content = await readFile(filePath, "utf-8");
            const parsed = JSON.parse(content);
            if (parsed.spec) {
              mainWindow?.webContents.send("watch:spec-changed", parsed.spec);
            }
          } catch {
          }
        }, 100);
      });
      console.log(`[Watch] Watching ${filePath} for live MCP changes`);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  });
  ipcMain.handle("watch:stop", () => {
    if (fileWatcher) {
      fileWatcher.close();
      fileWatcher = null;
      console.log(`[Watch] Stopped watching ${watchedPath}`);
      watchedPath = null;
    }
    return { success: true };
  });
  ipcMain.handle("watch:status", () => {
    return { watching: !!fileWatcher, path: watchedPath };
  });
}
app.whenReady().then(() => {
  setupIPC();
  setupMCPIPC();
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
nativeTheme.on("updated", () => {
  mainWindow?.webContents.send(
    "theme:changed",
    nativeTheme.shouldUseDarkColors ? "dark" : "light"
  );
});
