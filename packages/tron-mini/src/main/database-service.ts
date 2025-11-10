export interface StoredPlugin {
  id: string;
  name?: string;
  version?: string;
  path?: string;
  enabled?: boolean;
  data?: Record<string, any>;
}

export class DatabaseService {
  private plugins: Map<string, StoredPlugin> = new Map();

  async reset() {
    this.plugins.clear();
    return { success: true };
  }

  async getAllPlugins(): Promise<StoredPlugin[]> {
    return Array.from(this.plugins.values());
  }

  async getPluginById(id: string): Promise<StoredPlugin | undefined> {
    return this.plugins.get(id);
  }

  async addOrUpdatePlugin(descriptor: StoredPlugin) {
    const existing = this.plugins.get(descriptor.id) || { id: descriptor.id };
    const merged = { ...existing, ...descriptor };
    this.plugins.set(descriptor.id, merged);
    return merged;
  }

  async updatePlugin(id: string, update: Partial<StoredPlugin>) {
    const existing = this.plugins.get(id);
    if (!existing) return undefined;
    const merged = { ...existing, ...update };
    this.plugins.set(id, merged);
    return merged;
  }

  async removePlugin(id: string) {
    this.plugins.delete(id);
    return { success: true };
  }
}
