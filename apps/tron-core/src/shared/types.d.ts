export interface PluginManifest {
  name: string;
  version: string;
  description: string;
  author: string;
  license: string;
  type: 'ui' | 'background';
  permissions: string[];
  main?: string;
  ui?: string;
}
export interface PluginDescriptor {
  id: string;
  manifest: PluginManifest;
  path: string;
  status: 'installed' | 'loaded' | 'unloaded' | 'error';
  error?: string;
}
export interface PluginAPI {
  id: string;
  getData: (key: string) => Promise<any>;
  setData: (key: string, value: any) => Promise<void>;
  onMessage: (callback: (message: any) => void) => void;
  sendMessage: (message: any) => void;
}
export interface PluginInterface {
  manifest: PluginManifest;
  initialize: (api: PluginAPI) => Promise<void>;
  destroy?: () => Promise<void>;
}
export interface PluginMessage {
  type: string;
  pluginId?: string;
  payload?: any;
  timestamp?: number;
}
export interface PluginInstallRequest {
  path: string;
  isBuiltIn?: boolean;
}
export interface PluginInstallResponse {
  success: boolean;
  descriptor?: PluginDescriptor;
  error?: string;
}
//# sourceMappingURL=types.d.ts.map
