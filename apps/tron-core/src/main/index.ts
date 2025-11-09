import { app, BrowserWindow, ipcMain, Menu, shell, dialog } from 'electron';
import path from 'path';
import { PluginManager } from './plugin-manager';
import { PluginAPIBridge } from './plugin-api-bridge';
import { SecurityManager } from './security-manager';
import { DatabaseService } from './database-service';
import { PluginDevLoader } from './plugin-dev-loader';
import { PluginLoader } from './plugin-loader';
import { PluginDescriptor, PluginInstallResponse } from '../shared/types';

const isDev = process.env.NODE_ENV === 'development';

export class TronCoreApp {
  private mainWindow: BrowserWindow | null = null;
  private pluginManager!: PluginManager;
  private pluginAPIBridge!: PluginAPIBridge;
  private securityManager!: SecurityManager;
  private databaseService!: DatabaseService;
  private pluginDevLoader!: PluginDevLoader;
  private pluginLoader!: PluginLoader;
  private pluginWindows: Map<string, BrowserWindow> = new Map();

  constructor() {
    this.initializeServices();
    this.setupEventHandlers();
  }

  private async initializeServices() {
    // Initialize core services
    this.databaseService = new DatabaseService();
    await this.databaseService.initialize();

    this.securityManager = new SecurityManager();
    this.pluginAPIBridge = new PluginAPIBridge(this.databaseService);
    this.pluginManager = new PluginManager(
      this.databaseService,
      this.securityManager,
      this.pluginAPIBridge
    );

    this.pluginDevLoader = new PluginDevLoader(
      this.pluginAPIBridge,
      isDev
    );

    // Initialize plugin loader used by IPC handlers
    this.pluginLoader = new PluginLoader(this.pluginAPIBridge, this.databaseService, isDev);

    // Initialize plugin manager
    await this.pluginManager.initialize();
  }

  private setupEventHandlers() {
    app.whenReady().then(() => {
      this.createMainWindow();
      this.loadBuiltInPlugins();
    });

    app.on('window-all-closed', () => {
      if (process.platform !== 'darwin') {
        app.quit();
      }
    });

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        this.createMainWindow();
      }
    });

    app.on('before-quit', async () => {
      await this.cleanup();
    });
  }

  private createMainWindow() {
    this.mainWindow = new BrowserWindow({
      width: 1200,
      height: 800,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        preload: path.join(__dirname, 'preload.js'),
      },
      titleBarStyle: 'default',
    });

    // In our current setup, renderer is built with Vite in watch mode,
    // so we always load the built index.html from dist.
    this.mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
    if (isDev) {
      this.mainWindow.webContents.openDevTools();
    }

    this.mainWindow.webContents.on('did-finish-load', () => {
      this.mainWindow?.webContents.send('plugins-loaded', this.getLoadedPlugins());
    });

    this.setupIPCHandlers();
  }

  private setupIPCHandlers(): void {
    // Plugin management IPC handlers
    ipcMain.on('preload-ready', () => {
      console.log('[preload] ready, exposing electronAPI');
    });
    ipcMain.handle('get-plugins', async () => {
      try {
        return await this.databaseService.getAllPlugins();
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);
        console.error('[IPC] get-plugins error:', message);
        return [];
      }
    });

    ipcMain.handle('load-plugin', async (event, pluginId: string) => {
      try {
        const descriptor = await this.pluginLoader.loadInstalledPlugin(pluginId);
        return { success: !!descriptor, descriptor };
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);
        console.error('[IPC] load-plugin error:', message);
        return { success: false, error: message };
      }
    });

    ipcMain.handle('unload-plugin', async (event, pluginId: string) => {
      try {
        const success = await this.pluginLoader.unloadPlugin(pluginId);
        return { success };
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);
        console.error('[IPC] unload-plugin error:', message);
        return { success: false, error: message };
      }
    });

    ipcMain.handle('install-plugin', async (event, pluginPath: string) => {
      try {
        console.log('[IPC] install-plugin', pluginPath);
        const descriptor = await this.pluginLoader.loadExternalPlugin(pluginPath);
        return { success: !!descriptor, descriptor };
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);
        console.error('[IPC] install-plugin error:', message);
        return { success: false, error: message };
      }
    });

    // Open directory dialog for selecting plugin path
    ipcMain.handle('open-plugin-directory', async () => {
      try {
        const result = await dialog.showOpenDialog(this.mainWindow!, {
          properties: ['openDirectory'],
          title: 'Select Plugin Directory',
          buttonLabel: 'Select',
        });
        if (!result.canceled && result.filePaths.length > 0) {
          return { success: true, path: result.filePaths[0] };
        }
        return { success: false, error: 'Selection canceled' };
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);
        console.error('[IPC] open-plugin-directory error:', message);
        return { success: false, error: message };
      }
    });

    // Reset database: clears all plugins
    ipcMain.handle('reset-database', async () => {
      try {
        console.log('[IPC] reset-database');
        const plugins = await this.databaseService.getAllPlugins();
        for (const plugin of plugins) {
          await this.databaseService.deletePlugin(plugin.id);
        }
        return { success: true, message: 'Database reset successfully' };
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);
        console.error('[IPC] reset-database error:', message);
        return { success: false, error: message };
      }
    });

    // Simple test IPC to verify preload ↔ main communication
    ipcMain.handle('test-ipc', async () => {
      try {
        console.log('[IPC] test-ipc');
        const plugins = await this.databaseService.getAllPlugins();
        return { success: true, pluginsCount: plugins.length };
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);
        console.error('[IPC] test-ipc error:', message);
        return { success: false, error: message };
      }
    });
  }

  private async loadBuiltInPlugins(): Promise<void> {
    // Load built-in plugins from the plugins directory
    const builtInPluginsPath = path.join(__dirname, '../../plugins');
    
    try {
      const fs = await import('fs/promises');
      const pluginDirs = await fs.readdir(builtInPluginsPath);
      
      for (const pluginDir of pluginDirs) {
        const pluginPath = path.join(builtInPluginsPath, pluginDir);
        const stat = await fs.stat(pluginPath);
        
        if (stat.isDirectory()) {
          try {
            await this.pluginLoader.loadBuiltInPlugins();
            console.log(`Loaded built-in plugin: ${pluginDir}`);
          } catch (error) {
            console.error(`Failed to load built-in plugin ${pluginDir}:`, error);
          }
        }
      }
    } catch (error) {
      console.log('No built-in plugins found or error loading them:', error);
    }
  }

  private async loadPlugin(pluginId: string) {
    // Create plugin window
    const pluginWindow = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        preload: path.join(__dirname, 'preload.js'),
        additionalArguments: [`--plugin-id=${pluginId}`],
      },
      title: `Plugin: ${pluginId}`,
    });

    // Load plugin content
    const pluginPath = path.join(app.getPath('userData'), 'plugins', pluginId);
    const pluginIndex = path.join(pluginPath, 'dist', 'index.html');
    
    if (isDev) {
      // In development, load from plugin's dev server
      pluginWindow.loadURL(`http://localhost:5174?plugin=${pluginId}`);
    } else {
      pluginWindow.loadFile(pluginIndex);
    }

    this.pluginWindows.set(pluginId, pluginWindow);
    
    pluginWindow.on('closed', () => {
      this.pluginWindows.delete(pluginId);
    });

    return pluginWindow;
  }

  private async unloadPlugin(pluginId: string): Promise<void> {
    const window = this.pluginWindows.get(pluginId);
    if (window && !window.isDestroyed()) {
      window.close();
    }
    this.pluginWindows.delete(pluginId);
  }

  private getLoadedPlugins(): string[] {
    return Array.from(this.pluginWindows.keys());
  }

  private async cleanup() {
    // Close all plugin windows
    for (const [pluginId, window] of this.pluginWindows) {
      if (!window.isDestroyed()) {
        window.close();
      }
    }
    this.pluginWindows.clear();

    // Cleanup services
    await this.pluginManager.cleanup();
    await this.databaseService.close();
  }
}

// Create and start the app
const tronApp = new TronCoreApp();

// Handle app ready
app.whenReady().then(() => {
  console.log('Tron Core app is ready');
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});