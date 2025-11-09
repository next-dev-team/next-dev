import { PluginDescriptor, PluginInterface } from '../shared/types';
import * as path from 'path';
import * as fs from 'fs/promises';
import { PluginAPIBridge } from './plugin-api-bridge';
import { DatabaseService } from './database-service';
import { app } from 'electron';

export class PluginLoader {
  private pluginAPIBridge: PluginAPIBridge;
  private databaseService: DatabaseService;
  private loadedPlugins: Map<string, PluginInterface> = new Map();
private pluginWindows: Map<string, Electron.BrowserWindow> = new Map();
  private isDev: boolean = false;

  constructor(pluginAPIBridge: PluginAPIBridge, databaseService: DatabaseService, isDev: boolean) {
    this.pluginAPIBridge = pluginAPIBridge;
    this.databaseService = databaseService;
    this.isDev = isDev;
  }

  async loadBuiltInPlugins(): Promise<void> {
    const pluginsDir = path.join(__dirname, '../plugins');
    
    try {
      await fs.access(pluginsDir);
      const pluginDirs = await fs.readdir(pluginsDir, { withFileTypes: true });
      
      for (const dir of pluginDirs) {
        if (dir.isDirectory()) {
          const pluginPath = path.join(pluginsDir, dir.name);
          await this.loadPluginFromPath(pluginPath, true);
        }
      }
      if (this.isDev) {
        const counterPath = path.join(process.cwd(), 'apps/tron-counter-plugin');
        await this.loadPluginFromPath(counterPath, true);
      }
    } catch (error) {
      console.log('No built-in plugins directory found, creating one...');
      await fs.mkdir(pluginsDir, { recursive: true });
    }
  }

  async loadExternalPlugin(sourcePath: string): Promise<PluginDescriptor | null> {
    try {
      // Get manifest
      const manifestPath = path.join(sourcePath, 'package.json');
      const manifest = await this.loadPluginManifest(manifestPath);
      if (!manifest) {
        throw new Error('Plugin manifest not found or invalid');
      }

      const pluginId = manifest.name.toLowerCase().replace(/\s+/g, '-');
      const pluginsDir = path.join(app.getPath('userData'), 'plugins');
      const targetPath = path.join(pluginsDir, pluginId);

      // Create directories if needed
      await fs.mkdir(targetPath, { recursive: true });

      // Copy files
      await this.copyPluginFiles(sourcePath, targetPath);

      // Now load from the new path
      return await this.loadPluginFromPath(targetPath, false);
    } catch (error) {
      console.error('Failed to install plugin:', error);
      return null;
    }
  }

  private async copyPluginFiles(source: string, target: string): Promise<void> {
    const entries = await fs.readdir(source, { withFileTypes: true });
    for (const entry of entries) {
      const srcPath = path.join(source, entry.name);
      const tgtPath = path.join(target, entry.name);
      if (entry.isDirectory()) {
        await fs.mkdir(tgtPath, { recursive: true });
        await this.copyPluginFiles(srcPath, tgtPath);
      } else {
        await fs.copyFile(srcPath, tgtPath);
      }
    }
  }

  private async loadPluginFromPath(pluginPath: string, isBuiltIn: boolean): Promise<PluginDescriptor | null> {
    try {
      // Check if manifest exists
      const manifestPath = path.join(pluginPath, 'package.json');
      const manifest = await this.loadPluginManifest(manifestPath);
      
      if (!manifest) {
        throw new Error('Plugin manifest not found or invalid');
      }

      // Create plugin descriptor
      const descriptor: PluginDescriptor = {
        id: manifest.name.toLowerCase().replace(/\s+/g, '-'),
        manifest,
        path: pluginPath,
        status: 'installed'
      };

      // Load the plugin module
      const pluginModule = await this.loadPluginModule(pluginPath, manifest);
      if (!pluginModule) {
        throw new Error('Plugin module not found');
      }

      // Initialize the plugin
      const plugin = pluginModule.plugin || pluginModule.default || pluginModule;
      const pluginAPI = this.pluginAPIBridge.createPluginAPI(descriptor.id);
      
      await plugin.initialize(pluginAPI);
      
      // Store the loaded plugin
      this.loadedPlugins.set(descriptor.id, plugin);
      descriptor.status = 'loaded';
      
      // Create plugin window if it's a UI plugin
      if (manifest.type === 'ui') {
        await this.createPluginWindow(descriptor);
      }
      
      // Store in database
      await this.databaseService.addPlugin(descriptor);
      
      console.log(`Plugin '${manifest.name}' loaded successfully`);
      return descriptor;
      
    } catch (error) {
      console.error(`Failed to load plugin from ${pluginPath}:`, error);
      return null;
    }
  }

  private async loadPluginManifest(manifestPath: string): Promise<any> {
    try {
      const manifestContent = await fs.readFile(manifestPath, 'utf-8');
      const manifest = JSON.parse(manifestContent);
      
      // Check for tron-plugin configuration
      if (!manifest['tron-plugin']) {
        throw new Error('Plugin manifest missing tron-plugin configuration');
      }
      
      return {
        ...manifest['tron-plugin'],
        name: manifest.name,
        version: manifest.version,
        description: manifest.description,
        author: manifest.author,
        license: manifest.license
      };
    } catch (error) {
      console.error('Error loading plugin manifest:', error);
      return null;
    }
  }

  private async loadPluginModule(pluginPath: string, manifest: any): Promise<any> {
    try {
      // Try different module entry points
      const possibleEntries = [
        path.join(pluginPath, 'dist', 'plugin.js'),
        path.join(pluginPath, 'dist', 'plugin.cjs'),
        path.join(pluginPath, 'src', 'plugin.ts'),
        path.join(pluginPath, 'src', 'plugin.js'),
        path.join(pluginPath, 'plugin.js'),
        path.join(pluginPath, manifest.main || 'index.js')
      ];

      for (const entry of possibleEntries) {
        try {
          await fs.access(entry);
          
          // For development, we might need to handle TypeScript files differently
          if (entry.endsWith('.ts')) {
            // In development, we might need to compile TypeScript on the fly
            // For now, we'll try to require the JavaScript version
            const jsEntry = entry.replace('.ts', '.js');
            try {
              // eslint-disable-next-line @typescript-eslint/no-var-requires
              return require(jsEntry);
            } catch {
              // If JS version doesn't exist, try the TS version
              // eslint-disable-next-line @typescript-eslint/no-var-requires
              return require(entry);
            }
          } else {
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            return require(entry);
          }
        } catch {
          continue;
        }
      }
      
      throw new Error('No valid plugin entry point found');
    } catch (error) {
      console.error('Error loading plugin module:', error);
      return null;
    }
  }

  private async createPluginWindow(descriptor: PluginDescriptor): Promise<void> {
    const { BrowserWindow } = require('electron');
    
    const pluginWindow = new BrowserWindow({
      width: 800,
      height: 600,
      title: descriptor.manifest.name,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        preload: path.join(__dirname, 'preload.js'),
        additionalArguments: [`--plugin-id=${descriptor.id}`]
      }
    });

    // Load the plugin's UI
    const uiPath = path.join(descriptor.path, descriptor.manifest.ui || 'dist/index.html');
    
    try {
      await fs.access(uiPath);
      pluginWindow.loadFile(uiPath);
    } catch {
      // If the UI file doesn't exist, create a simple HTML page
      const fallbackHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>${descriptor.manifest.name}</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              display: flex; 
              justify-content: center; 
              align-items: center; 
              height: 100vh; 
              margin: 0;
              background: #f0f0f0;
            }
            .plugin-ui { 
              text-align: center; 
              padding: 2rem;
              background: white;
              border-radius: 10px;
              box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            }
          </style>
        </head>
        <body>
          <div class="plugin-ui">
            <h1>${descriptor.manifest.name}</h1>
            <p>${descriptor.manifest.description}</p>
            <p><em>Plugin UI loaded successfully</em></p>
          </div>
        </body>
        </html>
      `;
      pluginWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(fallbackHtml)}`);
    }

    // Store the window reference
    this.pluginWindows.set(descriptor.id, pluginWindow);

    // Handle window closed
    pluginWindow.on('closed', () => {
      this.pluginWindows.delete(descriptor.id);
    });
  }

  async loadInstalledPlugin(pluginId: string): Promise<PluginDescriptor | null> {
    try {
      const descriptor = await this.databaseService.getPlugin(pluginId);
      if (!descriptor) {
        throw new Error(`Plugin ${pluginId} not found in database`);
      }

      // Load the plugin module
      const pluginModule = await this.loadPluginModule(descriptor.path, descriptor.manifest);
      if (!pluginModule) {
        throw new Error('Plugin module not found');
      }

      // Initialize the plugin
      const plugin = pluginModule.plugin || pluginModule.default || pluginModule;
      const pluginAPI = this.pluginAPIBridge.createPluginAPI(descriptor.id);
      
      await plugin.initialize(pluginAPI);
      
      // Store the loaded plugin
      this.loadedPlugins.set(descriptor.id, plugin);
      descriptor.status = 'loaded';
      
      // Create plugin window if it's a UI plugin
      if (descriptor.manifest.type === 'ui') {
        await this.createPluginWindow(descriptor);
      }
      
      // Update database
      await this.databaseService.updatePlugin(descriptor);
      
      console.log(`Installed plugin '${pluginId}' loaded successfully`);
      return descriptor;
    } catch (error) {
      console.error(`Failed to load installed plugin '${pluginId}':`, error);
      return null;
    }
  }

  async unloadPlugin(pluginId: string): Promise<boolean> {
    const plugin = this.loadedPlugins.get(pluginId);
    if (!plugin) {
      return false;
    }

    try {
      // Destroy the plugin
      if (plugin.destroy) {
        await plugin.destroy();
      }

      // Close the plugin window if it exists
      const pluginWindow = this.pluginWindows.get(pluginId);
      if (pluginWindow && !pluginWindow.isDestroyed()) {
        pluginWindow.close();
      }

      // Remove from loaded plugins
      this.loadedPlugins.delete(pluginId);
      this.pluginWindows.delete(pluginId);

      // Update database
      const descriptor = await this.databaseService.getPlugin(pluginId);
      if (descriptor) {
        descriptor.status = 'unloaded';
        await this.databaseService.updatePlugin(descriptor);
      }

      console.log(`Plugin '${pluginId}' unloaded successfully`);
      return true;
    } catch (error) {
      console.error(`Failed to unload plugin '${pluginId}':`, error);
      return false;
    }
  }

  getLoadedPlugins(): string[] {
    return Array.from(this.loadedPlugins.keys());
  }

  isPluginLoaded(pluginId: string): boolean {
    return this.loadedPlugins.has(pluginId);
  }

  getPluginWindow(pluginId: string): Electron.BrowserWindow | undefined {
    return this.pluginWindows.get(pluginId);
  }
}