/**
 * DesignForge Desktop — Preload Script
 *
 * Bridges the Electron main process ↔ renderer process.
 * Uses contextBridge to safely expose IPC calls as the `designforge` API.
 *
 * This is the ONLY way the renderer can access Node.js/Electron APIs.
 * The renderer never gets direct access to require(), fs, etc.
 */

import { contextBridge, ipcRenderer } from 'electron';

export interface DesignForgeAPI {
  fs: {
    read(path: string): Promise<string>;
    write(path: string, content: string): Promise<void>;
    pick(filters?: string[]): Promise<string | null>;
    saveDialog(): Promise<string | null>;
  };
  theme: {
    get(): Promise<'light' | 'dark'>;
    onChange(cb: (theme: 'light' | 'dark') => void): () => void;
  };
  shell: {
    open(url: string): void;
  };
  window: {
    minimize(): void;
    maximize(): void;
    close(): void;
  };
  app: {
    version(): Promise<string>;
    name(): Promise<string>;
  };
}

const api: DesignForgeAPI = {
  fs: {
    read: (path: string) => ipcRenderer.invoke('fs:read', path),
    write: (path: string, content: string) => ipcRenderer.invoke('fs:write', path, content),
    pick: (filters?: string[]) => ipcRenderer.invoke('fs:pick', filters),
    saveDialog: () => ipcRenderer.invoke('fs:save-dialog'),
  },
  theme: {
    get: () => ipcRenderer.invoke('theme:get'),
    onChange: (cb: (theme: 'light' | 'dark') => void) => {
      const handler = (_event: Electron.IpcRendererEvent, theme: 'light' | 'dark') => cb(theme);
      ipcRenderer.on('theme:changed', handler);
      return () => {
        ipcRenderer.removeListener('theme:changed', handler);
      };
    },
  },
  shell: {
    open: (url: string) => ipcRenderer.invoke('shell:open', url),
  },
  window: {
    minimize: () => ipcRenderer.invoke('window:minimize'),
    maximize: () => ipcRenderer.invoke('window:maximize'),
    close: () => ipcRenderer.invoke('window:close'),
  },
  app: {
    version: () => ipcRenderer.invoke('app:version'),
    name: () => ipcRenderer.invoke('app:name'),
  },
};

contextBridge.exposeInMainWorld('designforge', api);
