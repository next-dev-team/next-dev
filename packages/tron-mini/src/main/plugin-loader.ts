import path from 'path';
import { BrowserWindow } from 'electron';
import { PluginAPIBridge } from './plugin-api-bridge';
import { DatabaseService } from './database-service';
import { SecurityManager } from './security-manager';

export interface LoadPluginOptions {
  id: string;
  name?: string;
  version?: string;
  entry?: string;
  isDev?: boolean;
}

export class PluginLoader {
  private pluginBridge: PluginAPIBridge;
  private databaseService: DatabaseService;
  private securityManager: SecurityManager;
  private pluginWindows: Map<string, BrowserWindow> = new Map();

  constructor(
    pluginBridge: PluginAPIBridge,
    databaseService: DatabaseService,
    securityManager: SecurityManager,
  ) {
    this.pluginBridge = pluginBridge;
    this.databaseService = databaseService;
    this.securityManager = securityManager;
  }

  async loadPlugin(opts: LoadPluginOptions): Promise<{ success: boolean; error?: string }> {
    try {
      const entry = opts.entry || path.join(process.cwd(), 'plugins', opts.id, 'index.html');
      const validation = this.securityManager.validatePluginCode(entry);
      if (!validation.valid) {
        return {
          success: false,
          error: validation.errors?.join(', ') || 'Security validation failed',
        };
      }

      const pluginWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
          preload: path.join(__dirname, '../preload/index.js'),
          nodeIntegration: false,
          contextIsolation: true,
          sandbox: true,
        },
      });

      const url = `file://${entry}?plugin=${encodeURIComponent(opts.id)}`;
      await pluginWindow.loadURL(url);

      this.pluginBridge.registerPluginWindow(opts.id, pluginWindow);
      this.pluginWindows.set(opts.id, pluginWindow);

      await this.databaseService.addOrUpdatePlugin({
        id: opts.id,
        name: opts.name,
        version: opts.version,
        path: entry,
        enabled: true,
      });
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e?.message || String(e) };
    }
  }

  async unloadPlugin(pluginId: string): Promise<{ success: boolean; error?: string }> {
    const win = this.pluginWindows.get(pluginId);
    if (win && !win.isDestroyed()) {
      win.destroy();
    }
    this.pluginBridge.unregisterPluginWindow(pluginId);
    this.pluginWindows.delete(pluginId);
    await this.databaseService.updatePlugin(pluginId, { enabled: false });
    return { success: true };
  }
}
