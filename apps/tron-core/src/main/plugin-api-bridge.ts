import { ipcMain, BrowserWindow } from 'electron';
import { DatabaseService } from './database-service';

export class PluginAPIBridge {
  private databaseService: DatabaseService;
  private pluginWindows: Map<string, BrowserWindow> = new Map();

  constructor(databaseService: DatabaseService) {
    this.databaseService = databaseService;
    this.setupIPCHandlers();
  }

  private setupIPCHandlers() {
    // Plugin API handlers
    ipcMain.handle(
      'plugin-api:register-component',
      async (event, pluginId: string, componentName: string, componentData: any) => {
        return this.registerComponent(pluginId, componentName, componentData);
      },
    );

    ipcMain.handle(
      'plugin-api:get-component',
      async (event, pluginId: string, componentName: string) => {
        return this.getComponent(pluginId, componentName);
      },
    );

    ipcMain.handle(
      'plugin-api:execute-command',
      async (event, pluginId: string, commandName: string, ...args: any[]) => {
        return this.executeCommand(pluginId, commandName, ...args);
      },
    );

    ipcMain.handle(
      'plugin-api:register-command',
      async (event, pluginId: string, commandName: string, handler: string) => {
        return this.registerCommand(pluginId, commandName, handler);
      },
    );

    ipcMain.handle('plugin-api:get-data', async (event, pluginId: string, key: string) => {
      return this.getPluginData(pluginId, key);
    });

    ipcMain.handle(
      'plugin-api:set-data',
      async (event, pluginId: string, key: string, value: any) => {
        return this.setPluginData(pluginId, key, value);
      },
    );
  }

  registerPluginWindow(pluginId: string, window: BrowserWindow) {
    this.pluginWindows.set(pluginId, window);
  }

  unregisterPluginWindow(pluginId: string) {
    this.pluginWindows.delete(pluginId);
  }

  private registerComponent(pluginId: string, componentName: string, componentData: any): boolean {
    // Store component data for the plugin
    console.log(`Plugin ${pluginId} registered component: ${componentName}`);
    return true;
  }

  private getComponent(pluginId: string, componentName: string): any {
    // Retrieve component data for the plugin
    console.log(`Getting component ${componentName} from plugin ${pluginId}`);
    return null;
  }

  private executeCommand(pluginId: string, commandName: string, ...args: any[]): any {
    // Execute command for the plugin
    console.log(`Executing command ${commandName} for plugin ${pluginId}`, args);
    return { success: true };
  }

  private registerCommand(pluginId: string, commandName: string, handler: string): boolean {
    // Register command handler for the plugin
    console.log(`Plugin ${pluginId} registered command: ${commandName}`);
    return true;
  }

  private async getPluginData(pluginId: string, key: string): Promise<any> {
    // Get plugin-specific data from database
    const plugin = await this.databaseService.getPluginById(pluginId);
    return plugin?.data?.[key];
  }

  private async setPluginData(pluginId: string, key: string, value: any): Promise<void> {
    // Set plugin-specific data in database
    const plugin = await this.databaseService.getPluginById(pluginId);
    if (plugin) {
      if (!plugin.data) {
        plugin.data = {};
      }
      plugin.data[key] = value;
      await this.databaseService.updatePlugin(pluginId, { data: plugin.data });
    }
  }

  broadcastToAllPlugins(channel: string, ...args: any[]) {
    for (const [pluginId, window] of this.pluginWindows) {
      if (!window.isDestroyed()) {
        window.webContents.send(channel, ...args);
      }
    }
  }

  sendToPlugin(pluginId: string, channel: string, ...args: any[]): boolean {
    const window = this.pluginWindows.get(pluginId);
    if (window && !window.isDestroyed()) {
      window.webContents.send(channel, ...args);
      return true;
    }
    return false;
  }

  // Minimal Plugin API for loaders
  createPluginAPI(pluginId: string) {
    return {
      id: pluginId,
      getData: async (key: string) => this.getPluginData(pluginId, key),
      setData: async (key: string, value: any) => this.setPluginData(pluginId, key, value),
      onMessage: (callback: (message: any) => void) => {
        const window = this.pluginWindows.get(pluginId);
        if (window && !window.isDestroyed()) {
          window.webContents.on('ipc-message', (_event, _channel, message) => {
            callback(message);
          });
        }
      },
      sendMessage: (message: any) => this.sendToPlugin(pluginId, 'plugin-message', message),
    };
  }
}
