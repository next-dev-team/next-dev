import type { PluginDescriptor } from '../types/plugins';

const STORAGE_KEY = 'tron-web.plugins';

export class WebDatabaseService {
  async getAllPlugins(): Promise<PluginDescriptor[]> {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    try {
      return JSON.parse(raw) as PluginDescriptor[];
    } catch {
      return [];
    }
  }

  async addOrUpdatePlugin(descriptor: PluginDescriptor): Promise<void> {
    const plugins = await this.getAllPlugins();
    const idx = plugins.findIndex(p => p.id === descriptor.id);
    if (idx >= 0) plugins[idx] = descriptor; else plugins.push(descriptor);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(plugins));
  }

  async updatePlugin(id: string, patch: Partial<PluginDescriptor>): Promise<void> {
    const plugins = await this.getAllPlugins();
    const idx = plugins.findIndex(p => p.id === id);
    if (idx >= 0) {
      plugins[idx] = { ...plugins[idx], ...patch } as PluginDescriptor;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(plugins));
    }
  }

  async removePlugin(id: string): Promise<void> {
    const plugins = await this.getAllPlugins();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(plugins.filter(p => p.id !== id)));
  }
}