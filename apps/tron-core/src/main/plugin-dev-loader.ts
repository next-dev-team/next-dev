import { PluginAPIBridge } from './plugin-api-bridge';

export class PluginDevLoader {
  private pluginAPIBridge: PluginAPIBridge;
  private isDev: boolean;

  constructor(pluginAPIBridge: PluginAPIBridge, isDev: boolean) {
    this.pluginAPIBridge = pluginAPIBridge;
    this.isDev = isDev;
  }

  async loadDevPlugin(pluginPath: string): Promise<void> {
    if (!this.isDev) {
      throw new Error('Development plugin loading is only available in development mode');
    }

    // Load plugin from development path
    console.log(`Loading development plugin from: ${pluginPath}`);

    // In development, plugins can be loaded directly from their source
    // This allows hot reloading and easier development
    try {
      const pluginModule = await import(pluginPath);

      if (pluginModule.default) {
        const plugin = pluginModule.default;
        console.log(`Development plugin loaded: ${plugin.metadata?.name || 'Unknown'}`);

        // Register plugin with API bridge
        // This would typically involve more complex setup
        return plugin;
      }
    } catch (error) {
      console.error('Failed to load development plugin:', error);
      throw error;
    }
  }

  async watchPluginChanges(
    pluginPath: string,
    callback: (event: string, filename: string | Buffer | null) => void,
  ): Promise<void> {
    if (!this.isDev) {
      return;
    }

    try {
      const fs = await import('fs');
      fs.watch(pluginPath, { recursive: true }, callback);

      console.log(`Watching for changes in: ${pluginPath}`);
      return;
    } catch (error) {
      console.error('Failed to watch plugin for changes:', error);
    }
  }
}
