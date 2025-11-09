export class DatabaseService {
  private plugins: Map<string, any> = new Map();

  async initialize(): Promise<void> {
    // In-memory database for now, can be replaced with SQLite or other DB
    console.log('Database service initialized');
  }

  async getAllPlugins(): Promise<any[]> {
    return Array.from(this.plugins.values());
  }

  async getPluginById(pluginId: string): Promise<any | undefined> {
    return this.plugins.get(pluginId);
  }

  async savePlugin(plugin: any): Promise<void> {
    this.plugins.set(plugin.id, plugin);
  }

  // Overloaded update method to support different call sites
  async updatePlugin(pluginId: string, updates: Partial<any>): Promise<void>;
  async updatePlugin(descriptor: any): Promise<void>;
  async updatePlugin(arg1: string | any, updates?: Partial<any>): Promise<void> {
    if (typeof arg1 === 'string') {
      const plugin = this.plugins.get(arg1);
      if (plugin) {
        this.plugins.set(arg1, { ...plugin, ...updates });
      }
      return;
    }
    const descriptor = arg1;
    if (descriptor && descriptor.id) {
      this.plugins.set(descriptor.id, descriptor);
    }
  }

  async deletePlugin(pluginId: string): Promise<void> {
    this.plugins.delete(pluginId);
  }

  async close(): Promise<void> {
    // Cleanup
    this.plugins.clear();
  }

  // Additional helpers expected by some loaders
  async addPlugin(descriptor: any): Promise<void> {
    await this.savePlugin(descriptor);
  }

  async getPlugin(pluginId: string): Promise<any | undefined> {
    return this.getPluginById(pluginId);
  }
}