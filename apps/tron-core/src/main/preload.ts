import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  getPlugins: () => ipcRenderer.invoke('get-plugins'),
  loadPlugin: (pluginId: string) => ipcRenderer.invoke('load-plugin', pluginId),
  unloadPlugin: (pluginId: string) => ipcRenderer.invoke('unload-plugin', pluginId),
  installPlugin: (pluginPath: string) => ipcRenderer.invoke('install-plugin', pluginPath),
  openPluginDirectory: () => ipcRenderer.invoke('open-plugin-directory'),
  resetDatabase: () => ipcRenderer.invoke('reset-database'),
  testIPC: () => ipcRenderer.invoke('test-ipc'),
  // Event listeners
  onPluginsLoaded: (callback: (loadedPlugins: string[]) => void) => {
    ipcRenderer.on('plugins-loaded', (event, loadedPlugins) => callback(loadedPlugins));
  },
  // Add any other IPC handlers used in renderer
});