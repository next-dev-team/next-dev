import { WebDatabaseService } from './web-database-service';
import { WebSecurityManager } from './web-security-manager';
import { WebPluginBridge } from './web-plugin-bridge';
import type { PluginDescriptor } from '../types/plugins';

export class WebPluginLoader {
  private db = new WebDatabaseService();
  private security = new WebSecurityManager();
  private bridge = new WebPluginBridge();
  private frames: Map<string, HTMLIFrameElement> = new Map();

  async list(): Promise<PluginDescriptor[]> {
    return this.db.getAllPlugins();
  }

  async installFromUrl(uiUrl: string, meta?: Partial<PluginDescriptor>): Promise<PluginDescriptor> {
    const url = new URL(uiUrl);
    const id = (meta?.id || url.hostname + url.pathname).replace(/[^a-z0-9-]/gi, '-').toLowerCase();
    const descriptor: PluginDescriptor = {
      id,
      name: meta?.name || url.hostname,
      version: meta?.version || '0.0.0',
      source: uiUrl,
      uiUrl,
      metadata: {
        name: meta?.name || url.hostname,
        version: meta?.version || '0.0.0',
        type: 'ui',
        permissions: [],
      },
      config: { enabled: true, autoStart: false },
      status: 'installed',
    };
    await this.db.addOrUpdatePlugin(descriptor);
    return descriptor;
  }

  /** Install plugin by selecting a built dist folder (FileList from input with webkitdirectory). */
  async installFromDirectory(files: FileList): Promise<PluginDescriptor> {
    // Find package.json if present to derive metadata
    let pkg: any = null;
    const byPath: Record<string, File> = {};
    for (const file of Array.from(files)) {
      const rel = (file as any).webkitRelativePath || file.name;
      byPath[rel] = file;
      if (rel.endsWith('package.json')) {
        const text = await file.text();
        try {
          pkg = JSON.parse(text);
        } catch {}
      }
    }

    const tron = pkg?.['tron-plugin'] || {};
    const id = (pkg?.name || tron?.name || 'local-plugin')
      .toLowerCase()
      .replace(/[^a-z0-9-]/gi, '-');
    const name = tron?.name || pkg?.name || id;
    const version = tron?.version || pkg?.version || '0.0.0';

    // Register assets with service worker under /plugins/<id>/... paths
    await this.registerAssetsWithServiceWorker(id, files);

    const uiUrl = `/plugins/${id}/index.html`;
    const descriptor: PluginDescriptor = {
      id,
      name,
      version,
      source: 'local:dist',
      uiUrl,
      metadata: {
        name,
        version,
        type: 'ui',
        permissions: [],
      },
      config: { enabled: true, autoStart: false },
      status: 'installed',
    };
    await this.db.addOrUpdatePlugin(descriptor);
    return descriptor;
  }

  private async registerAssetsWithServiceWorker(pluginId: string, files: FileList) {
    if (!('serviceWorker' in navigator))
      throw new Error('Service worker not supported in this browser');
    const reg = await navigator.serviceWorker.ready;
    const sw = reg.active || navigator.serviceWorker.controller;
    if (!sw) throw new Error('Service worker not active');

    const assets: Array<{ path: string; contentType: string; data: ArrayBuffer }> = [];
    for (const file of Array.from(files)) {
      const rel = (file as any).webkitRelativePath || file.name; // path relative to selected folder
      const buf = await file.arrayBuffer();
      const type = this.mimeFromPath(rel);
      assets.push({ path: rel, contentType: type, data: buf });
    }

    // Transfer ArrayBuffers for performance
    const transfers = assets.map((a) => a.data);
    sw.postMessage({ type: 'tron:registerPlugin', pluginId, assets }, transfers);
  }

  private mimeFromPath(p: string): string {
    const ext = p.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'html':
        return 'text/html';
      case 'js':
        return 'application/javascript';
      case 'mjs':
        return 'application/javascript';
      case 'css':
        return 'text/css';
      case 'svg':
        return 'image/svg+xml';
      case 'png':
        return 'image/png';
      case 'jpg':
      case 'jpeg':
        return 'image/jpeg';
      case 'gif':
        return 'image/gif';
      case 'webp':
        return 'image/webp';
      case 'json':
        return 'application/json';
      case 'map':
        return 'application/json';
      case 'woff':
        return 'font/woff';
      case 'woff2':
        return 'font/woff2';
      default:
        return 'application/octet-stream';
    }
  }

  async load(plugin: PluginDescriptor, container: HTMLElement): Promise<boolean> {
    if (!plugin.uiUrl) return false;
    const asUrl = new URL(plugin.uiUrl, window.location.origin);
    const origin = asUrl.origin;
    if (!this.security.isOriginAllowed(origin)) {
      console.warn('[security] origin not allowed', origin);
    }
    const iframe = document.createElement('iframe');
    iframe.className = 'iframe';
    // Use original value for src (relative paths are fine), but we have a normalized URL for checks
    iframe.src = plugin.uiUrl;
    iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-forms allow-popups');
    container.innerHTML = '';
    const wrap = document.createElement('div');
    wrap.className = 'iframe-wrap';
    wrap.appendChild(iframe);
    container.appendChild(wrap);

    iframe.addEventListener('load', () => {
      this.bridge.attach(plugin.id, iframe);
    });

    this.frames.set(plugin.id, iframe);
    await this.db.updatePlugin(plugin.id, { status: 'loaded' });
    return true;
  }

  async unload(pluginId: string): Promise<boolean> {
    const iframe = this.frames.get(pluginId);
    if (iframe) {
      this.bridge.detach(pluginId);
      iframe.remove();
      this.frames.delete(pluginId);
      await this.db.updatePlugin(pluginId, { status: 'unloaded' });
      return true;
    }
    return false;
  }
}
