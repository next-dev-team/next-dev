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
  }
};
contextBridge.exposeInMainWorld("designforge", api);
