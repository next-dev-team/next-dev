import { contextBridge, ipcRenderer } from 'electron';

// Setup and expose Electron APIs to renderer
export function setupPreload() {
  try {
    ipcRenderer.send('preload-ready');
  } catch {}

  contextBridge.exposeInMainWorld('electronAPI', {
    // Plugin management
    getPlugins: () => ipcRenderer.invoke('get-plugins'),
    loadPlugin: (pluginPath: string) => ipcRenderer.invoke('load-plugin', pluginPath),
    unloadPlugin: (pluginId: string) => ipcRenderer.invoke('unload-plugin', pluginId),
    installPlugin: (pluginPath: string) => ipcRenderer.invoke('install-plugin', pluginPath),
    resetDatabase: () => ipcRenderer.invoke('reset-database'),
    testIPC: () => ipcRenderer.invoke('test-ipc'),
    openPluginDirectory: () => ipcRenderer.invoke('open-plugin-directory'),

    // Plugin API
    pluginAPI: {
      registerComponent: (pluginId: string, componentName: string, componentData: any) =>
        ipcRenderer.invoke('plugin-api:register-component', pluginId, componentName, componentData),
      getComponent: (pluginId: string, componentName: string) =>
        ipcRenderer.invoke('plugin-api:get-component', pluginId, componentName),
      executeCommand: (pluginId: string, commandName: string, ...args: any[]) =>
        ipcRenderer.invoke('plugin-api:execute-command', pluginId, commandName, ...args),
      registerCommand: (pluginId: string, commandName: string, handler: string) =>
        ipcRenderer.invoke('plugin-api:register-command', pluginId, commandName, handler),
      getData: (pluginId: string, key: string) =>
        ipcRenderer.invoke('plugin-api:get-data', pluginId, key),
      setData: (pluginId: string, key: string, value: any) =>
        ipcRenderer.invoke('plugin-api:set-data', pluginId, key, value),
    },

    // Event listeners
    onPluginsLoaded: (callback: (plugins: string[]) => void) => {
      ipcRenderer.on('plugins-loaded', (event, plugins) => callback(plugins));
    },
    removeAllListeners: (channel: string) => {
      ipcRenderer.removeAllListeners(channel);
    },
  });

  // Plugin-specific preload for plugin windows
  const pluginId = new URLSearchParams(window.location.search).get('plugin');
  if (pluginId) {
    contextBridge.exposeInMainWorld('pluginAPI', {
      id: pluginId,
      registerComponent: (componentName: string, componentData: any) =>
        ipcRenderer.invoke('plugin-api:register-component', pluginId, componentName, componentData),
      getComponent: (componentName: string) =>
        ipcRenderer.invoke('plugin-api:get-component', pluginId, componentName),
      executeCommand: (commandName: string, ...args: any[]) =>
        ipcRenderer.invoke('plugin-api:execute-command', pluginId, commandName, ...args),
      registerCommand: (commandName: string, handler: string) =>
        ipcRenderer.invoke('plugin-api:register-command', pluginId, commandName, handler),
      getData: (key: string) => ipcRenderer.invoke('plugin-api:get-data', pluginId, key),
      setData: (key: string, value: any) =>
        ipcRenderer.invoke('plugin-api:set-data', pluginId, key, value),
    });
  }
}

// Auto-run when used directly as a preload script
try {
  // If running inside Electron preload context, this will succeed and setup APIs
  setupPreload();
} catch {
  // Ignore errors when imported in non-Electron environments
}

export type { ElectronAPI, PluginAPI } from './types';
