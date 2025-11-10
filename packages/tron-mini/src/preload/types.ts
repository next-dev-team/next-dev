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