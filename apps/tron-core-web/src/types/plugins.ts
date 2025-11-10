export interface PluginMetadata {
  name: string;
  version: string;
  description?: string;
  author?: string;
  license?: string;
  homepage?: string;
  repository?: any;
  keywords?: string[];
  type?: 'ui' | 'background';
  permissions?: string[];
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
  source?: string; // e.g., URL
  uiUrl?: string; // web: iframe src
  metadata: PluginMetadata;
  config: PluginConfig;
  status?: 'installed' | 'loaded' | 'unloaded' | 'error';
  error?: string;
}