/**
 * Electron Host Adapter
 *
 * Implements the HostAdapter interface from editor-ui using
 * the `window.designforge` API exposed by the preload script.
 */

import type { HostAdapter } from '@next-dev/editor-ui/host';
import type { DesignForgeAPI } from '../../preload/index';

declare global {
  interface Window {
    designforge: DesignForgeAPI;
  }
}

export function createElectronAdapter(): HostAdapter {
  const api = window.designforge;
  let currentTheme: 'light' | 'dark' = 'dark';

  // Sync initial theme
  api.theme.get().then((t) => {
    currentTheme = t;
  });

  return {
    fs: {
      read: (path: string) => api.fs.read(path),
      write: (path: string, content: string) => api.fs.write(path, content),
      pick: (filters?: string[]) => api.fs.pick(filters),
      watch: (_path: string, _cb: () => void) => {
        // TODO: implement file watching via IPC
        return () => {};
      },
    },
    theme: {
      get: () => currentTheme,
      onChange: (cb: (t: 'light' | 'dark') => void) => {
        return api.theme.onChange((t) => {
          currentTheme = t;
          cb(t);
        });
      },
    },
    shell: {
      open: (url: string) => api.shell.open(url),
      notify: (msg: string) => {
        new Notification('DesignForge', { body: msg });
      },
      clipboard: {
        read: () => navigator.clipboard.readText(),
        write: (s: string) => navigator.clipboard.writeText(s),
      },
    },
  };
}
