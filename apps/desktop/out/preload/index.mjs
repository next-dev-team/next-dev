import { contextBridge, ipcRenderer } from "electron";
const api = {
  fs: {
    read: (path) => ipcRenderer.invoke("fs:read", path),
    write: (path, content) => ipcRenderer.invoke("fs:write", path, content),
    pick: (filters) => ipcRenderer.invoke("fs:pick", filters),
    saveDialog: () => ipcRenderer.invoke("fs:save-dialog")
  },
  theme: {
    get: () => ipcRenderer.invoke("theme:get"),
    onChange: (cb) => {
      const handler = (_event, theme) => cb(theme);
      ipcRenderer.on("theme:changed", handler);
      return () => {
        ipcRenderer.removeListener("theme:changed", handler);
      };
    }
  },
  shell: {
    open: (url) => ipcRenderer.invoke("shell:open", url)
  },
  window: {
    minimize: () => ipcRenderer.invoke("window:minimize"),
    maximize: () => ipcRenderer.invoke("window:maximize"),
    close: () => ipcRenderer.invoke("window:close")
  },
  app: {
    version: () => ipcRenderer.invoke("app:version"),
    name: () => ipcRenderer.invoke("app:name")
  },
  mcp: {
    connect: () => ipcRenderer.invoke("mcp:connect"),
    disconnect: () => ipcRenderer.invoke("mcp:disconnect"),
    status: () => ipcRenderer.invoke("mcp:status"),
    listTools: () => ipcRenderer.invoke("mcp:list-tools"),
    call: (toolName, args) => ipcRenderer.invoke("mcp:call", toolName, args),
    publishContext: (snapshot) => ipcRenderer.invoke("mcp:publish-context", snapshot),
    onApplyLiveMutation: (cb) => {
      const handler = (_event, request) => cb(request);
      ipcRenderer.on("mcp:apply-live-mutation", handler);
      return () => {
        ipcRenderer.removeListener("mcp:apply-live-mutation", handler);
      };
    },
    respondMutationResult: (requestId, result) => ipcRenderer.invoke("mcp:mutation-result", requestId, result)
  },
  watch: {
    start: (filePath) => ipcRenderer.invoke("watch:start", filePath),
    stop: () => ipcRenderer.invoke("watch:stop"),
    status: () => ipcRenderer.invoke("watch:status"),
    onSpecChanged: (cb) => {
      const handler = (_event, spec) => cb(spec);
      ipcRenderer.on("watch:spec-changed", handler);
      return () => {
        ipcRenderer.removeListener("watch:spec-changed", handler);
      };
    }
  }
};
contextBridge.exposeInMainWorld("designforge", api);
