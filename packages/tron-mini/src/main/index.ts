import path from 'path';
import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import { DatabaseService } from './database-service';
import { PluginAPIBridge } from './plugin-api-bridge';
import { SecurityManager } from './security-manager';
import { PluginLoader } from './plugin-loader';

export class TronMiniApp {
  private mainWindow: BrowserWindow | null = null;
  private databaseService = new DatabaseService();
  private pluginBridge = new PluginAPIBridge(this.databaseService);
  private securityManager = new SecurityManager();
  private pluginLoader = new PluginLoader(this.pluginBridge, this.databaseService, this.securityManager);

  async init() {
    await app.whenReady();
    this.setupIPC();
    await this.createMainWindow();
  }

  private setupIPC() {
    ipcMain.handle('get-plugins', async () => {
      return this.databaseService.getAllPlugins();
    });
    ipcMain.handle('load-plugin', async (_event, pluginId: string) => {
      return this.pluginLoader.loadPlugin({ id: pluginId });
    });
    ipcMain.handle('unload-plugin', async (_event, pluginId: string) => {
      return this.pluginLoader.unloadPlugin(pluginId);
    });
    ipcMain.handle('install-plugin', async (_event, pluginPath: string) => {
      // Simplified install; just record path
      const id = path.basename(pluginPath);
      await this.databaseService.addOrUpdatePlugin({ id, path: pluginPath, enabled: false });
      return { success: true, plugin: { id, path: pluginPath } };
    });
    ipcMain.handle('reset-database', async () => {
      return this.databaseService.reset();
    });
    ipcMain.handle('test-ipc', async () => {
      const plugins = await this.databaseService.getAllPlugins();
      return { success: true, pluginsCount: plugins.length };
    });
    ipcMain.handle('open-plugin-directory', async () => {
      const result = await dialog.showOpenDialog({ properties: ['openDirectory'] });
      return { success: true, path: result.filePaths?.[0] };
    });
  }

  private async createMainWindow() {
    this.mainWindow = new BrowserWindow({
      width: 1024,
      height: 768,
      webPreferences: {
        preload: path.join(__dirname, '../preload/index.js'),
        nodeIntegration: false,
        contextIsolation: true,
      },
    });
    await this.mainWindow.loadURL('about:blank');
  }
}

export default TronMiniApp;