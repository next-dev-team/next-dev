import { contextBridge, ipcRenderer } from 'electron';

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
// Signal to main that preload is running
try {
  ipcRenderer.send('preload-ready');
} catch {}

contextBridge.exposeInMainWorld('electronAPI', {
  // Plugin management
  getPlugins: () => ipcRenderer.invoke('get-plugins'),
  // load external plugin from a path
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
    
    getData: (key: string) => 
      ipcRenderer.invoke('plugin-api:get-data', pluginId, key),
    
    setData: (key: string, value: any) => 
      ipcRenderer.invoke('plugin-api:set-data', pluginId, key, value),
  });
}

export interface ElectronAPI {
  getPlugins: () => Promise<any[]>;
  loadPlugin: (pluginId: string) => Promise<{ success: boolean; error?: string }>;
  unloadPlugin: (pluginId: string) => Promise<{ success: boolean; error?: string }>;
  installPlugin: (pluginPath: string) => Promise<{ success: boolean; plugin?: any; error?: string }>;
  resetDatabase: () => Promise<{ success: boolean; message?: string; error?: string }>;
  testIPC: () => Promise<{ success: boolean; pluginsCount?: number; error?: string }>;
  openPluginDirectory: () => Promise<{ success: boolean; path?: string; error?: string }>;
  pluginAPI: {
    registerComponent: (pluginId: string, componentName: string, componentData: any) => Promise<boolean>;
    getComponent: (pluginId: string, componentName: string) => Promise<any>;
    executeCommand: (pluginId: string, commandName: string, ...args: any[]) => Promise<any>;
    registerCommand: (pluginId: string, commandName: string, handler: string) => Promise<boolean>;
    getData: (pluginId: string, key: string) => Promise<any>;
    setData: (pluginId: string, key: string, value: any) => Promise<void>;
  };
  onPluginsLoaded: (callback: (plugins: string[]) => void) => void;
  removeAllListeners: (channel: string) => void;
}

export interface PluginAPI {
  id: string;
  registerComponent: (componentName: string, componentData: any) => Promise<boolean>;
  getComponent: (componentName: string) => Promise<any>;
  executeCommand: (commandName: string, ...args: any[]) => Promise<any>;
  registerCommand: (commandName: string, handler: string) => Promise<boolean>;
  getData: (key: string) => Promise<any>;
  setData: (key: string, value: any) => Promise<void>;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
    pluginAPI: PluginAPI;
  }
}