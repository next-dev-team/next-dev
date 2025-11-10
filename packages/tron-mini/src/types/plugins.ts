// Shared plugin types for Tron ecosystem

export interface PluginMetadata {
  name: string;
  version: string;
  description?: string;
  author?: string;
  license?: string;
  homepage?: string;
  repository?: any;
  keywords?: string[];
  dependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
  engines?: Record<string, string>;
  permissions?: string[];
  type?: 'ui' | 'background';
  main?: string;
  ui?: string;
}

export interface PluginConfig {
  enabled: boolean;
  autoStart: boolean;
  [key: string]: any;
}

export interface PluginDescriptor {
  id: string;
  name: string;
  version: string;
  path?: string;
  source?: string;
  metadata: PluginMetadata;
  config: PluginConfig;
  status?: 'installed' | 'loaded' | 'unloaded' | 'error';
  error?: string;
  manifest?: PluginManifest;
}

export interface PluginContext {
  app: any;
  config: Record<string, any>;
  logger: Console;
  events: NodeJS.EventEmitter;
  plugins: any;
  utils: Record<string, any>;
  pluginId: string;
}

export interface Plugin {
  metadata: PluginMetadata;
  config: PluginConfig;
  hooks?: Record<string, any>;
  api?: Record<string, any>;
  exports?: Record<string, any>;
  init?: (context: PluginContext) => Promise<void>;
  stop?: (context: PluginContext) => Promise<void>;
  initialize?: (api: any) => Promise<void>;
  destroy?: () => Promise<void>;
}

export interface PluginManifest {
  name: string;
  version: string;
  description?: string;
  author?: string;
  license?: string;
  type: 'ui' | 'background';
  permissions: string[];
  main?: string;
  ui?: string;
}

export interface PluginInstallResponse {
  success: boolean;
  descriptor?: PluginDescriptor;
  error?: string;
}