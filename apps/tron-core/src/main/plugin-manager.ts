import { ipcMain, BrowserWindow } from 'electron';
import path from 'path';
import fs from 'fs/promises';
import { Plugin, PluginMetadata, PluginDescriptor, PluginContext } from '@rnr/tron-mini/types/plugins';
import { EventEmitter } from 'events';
import { DatabaseService } from './database-service';
import { SecurityManager } from './security-manager';
import { PluginAPIBridge } from './plugin-api-bridge';

export class PluginManager {
  private databaseService: DatabaseService;
  private securityManager: SecurityManager;
  private pluginAPIBridge: PluginAPIBridge;
  private plugins: Map<string, PluginDescriptor> = new Map();
  private pluginInstances: Map<string, Plugin> = new Map();

  constructor(
    databaseService: DatabaseService,
    securityManager: SecurityManager,
    pluginAPIBridge: PluginAPIBridge
  ) {
    this.databaseService = databaseService;
    this.securityManager = securityManager;
    this.pluginAPIBridge = pluginAPIBridge;
  }

  async initialize(): Promise<void> {
    // Load existing plugins from database
    const savedPlugins = await this.databaseService.getAllPlugins();
    
    for (const plugin of savedPlugins) {
      this.plugins.set(plugin.id, {
        id: plugin.id,
        name: plugin.name,
        version: plugin.version,
        path: plugin.path,
        source: plugin.source,
        config: plugin.config,
        metadata: plugin.metadata,
      });
    }
  }

  async installPlugin(sourcePath: string): Promise<Plugin> {
    // Validate plugin source
    const manifestPath = path.join(sourcePath, 'package.json');
    const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf-8'));
    
    // Validate plugin metadata
    const metadata: PluginMetadata = {
      name: manifest.name,
      version: manifest.version,
      description: manifest.description,
      author: manifest.author,
      license: manifest.license,
      homepage: manifest.homepage,
      repository: manifest.repository,
      keywords: manifest.keywords,
      dependencies: manifest.dependencies,
      peerDependencies: manifest.peerDependencies,
      engines: manifest.engines,
    };

    // Security validation
    await this.securityManager.validatePlugin(sourcePath, metadata);

    // Copy plugin to user data directory
    const pluginId = metadata.name;
    const pluginsDir = path.join(sourcePath, '../../plugins'); // Adjust path as needed
    const targetPath = path.join(pluginsDir, pluginId);

    // Copy plugin files
    await this.copyPluginFiles(sourcePath, targetPath);

    // Create plugin descriptor
    const descriptor: PluginDescriptor = {
      id: pluginId,
      name: metadata.name,
      version: metadata.version,
      path: targetPath,
      source: 'local',
      metadata,
      config: {
        enabled: true,
        autoStart: false,
      },
    };

    // Load plugin
    const plugin = await this.loadPlugin(descriptor);
    
    // Save to database
    await this.databaseService.savePlugin({
      id: pluginId,
      name: metadata.name,
      version: metadata.version,
      path: targetPath,
      source: 'local',
      isActive: true,
      config: descriptor.config,
      metadata,
    });

    this.plugins.set(pluginId, descriptor);
    this.pluginInstances.set(pluginId, plugin);

    return plugin;
  }

  private async loadPlugin(descriptor: PluginDescriptor): Promise<Plugin> {
    // Load plugin module
    const pluginPath = descriptor.path ?? '';
    const pluginModule = await import(path.join(pluginPath, 'dist', 'index.js'));
    
    const plugin: Plugin = {
      metadata: descriptor.metadata as PluginMetadata,
      config: descriptor.config,
      hooks: pluginModule.hooks,
      api: pluginModule.api,
      exports: pluginModule.exports,
    };

    // Initialize plugin if it has init method
    if (plugin.init) {
      const context = this.createPluginContext(descriptor.id);
      await plugin.init(context);
    }

    return plugin;
  }

  private createPluginContext(pluginId: string): PluginContext {
    const events = new EventEmitter();
    const context: PluginContext = {
      app: null, // Will be set by main app
      config: {},
      logger: console,
      events,
      plugins: this as any,
      utils: {},
      pluginId,
    };
    return context;
  }

  private async copyPluginFiles(sourcePath: string, targetPath: string): Promise<void> {
    await fs.mkdir(targetPath, { recursive: true });
    
    const files = await fs.readdir(sourcePath);
    for (const file of files) {
      const srcFile = path.join(sourcePath, file);
      const destFile = path.join(targetPath, file);
      const stat = await fs.stat(srcFile);
      
      if (stat.isDirectory()) {
        await this.copyPluginFiles(srcFile, destFile);
      } else {
        await fs.copyFile(srcFile, destFile);
      }
    }
  }

  async uninstallPlugin(pluginId: string): Promise<void> {
    const plugin = this.plugins.get(pluginId);
    if (!plugin) {
      throw new Error(`Plugin ${pluginId} not found`);
    }

    // Stop plugin if running
    await this.stopPlugin(pluginId);

    // Remove from database
    await this.databaseService.deletePlugin(pluginId);

    // Remove from memory
    this.plugins.delete(pluginId);
    this.pluginInstances.delete(pluginId);
  }

  async stopPlugin(pluginId: string): Promise<void> {
    const plugin = this.pluginInstances.get(pluginId);
    if (plugin && plugin.stop) {
      const context = this.createPluginContext(pluginId);
      await plugin.stop(context);
    }
  }

  async cleanup(): Promise<void> {
    // Stop all plugins
    for (const pluginId of this.pluginInstances.keys()) {
      await this.stopPlugin(pluginId);
    }
  }

  getAllPlugins(): PluginDescriptor[] {
    return Array.from(this.plugins.values());
  }

  getPlugin(pluginId: string): PluginDescriptor | undefined {
    return this.plugins.get(pluginId);
  }

  getPluginInstance(pluginId: string): Plugin | undefined {
    return this.pluginInstances.get(pluginId);
  }
}