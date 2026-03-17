/**
 * Host Adapter Interface
 *
 * editor-ui NEVER imports Electron or VS Code directly.
 * Instead, each host provides an adapter implementing this interface.
 *
 * Hosts:
 * - Electron: adapter uses IPC → main process → Node fs
 * - VS Code: adapter uses postMessage → extension host → vscode.workspace
 * - Browser: File System Access API + IndexedDB (future)
 */

export interface HostAdapter {
  /** File system operations */
  fs: {
    /** Read a file's contents */
    read(path: string): Promise<string>;
    /** Write content to a file */
    write(path: string, content: string): Promise<void>;
    /** Open a file picker, returns path or null if cancelled */
    pick(filters?: string[]): Promise<string | null>;
    /** Watch a file for changes, returns unsubscribe function */
    watch(path: string, cb: () => void): () => void;
  };

  /** Theme/appearance */
  theme: {
    /** Get current theme */
    get(): 'light' | 'dark';
    /** Subscribe to theme changes, returns unsubscribe */
    onChange(cb: (t: 'light' | 'dark') => void): () => void;
  };

  /** Shell / OS integration */
  shell: {
    /** Open a URL in the default browser */
    open(url: string): void;
    /** Show a native notification */
    notify(msg: string): void;
    /** Clipboard operations */
    clipboard: {
      read(): Promise<string>;
      write(s: string): Promise<void>;
    };
  };
}

/**
 * Browser host adapter — works without Electron or VS Code.
 * Uses in-memory storage and browser APIs.
 */
export function createBrowserAdapter(): HostAdapter {
  const files = new Map<string, string>();
  const watchers = new Map<string, Set<() => void>>();
  let theme: 'light' | 'dark' =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';

  return {
    fs: {
      async read(path) {
        const content = files.get(path);
        if (content === undefined) throw new Error(`File not found: ${path}`);
        return content;
      },
      async write(path, content) {
        files.set(path, content);
        const pathWatchers = watchers.get(path);
        if (pathWatchers) {
          for (const cb of pathWatchers) cb();
        }
      },
      async pick(_filters) {
        // In browser: use File System Access API if available
        if ('showOpenFilePicker' in window) {
          try {
            const [handle] = await (window as unknown as { showOpenFilePicker: (opts: unknown) => Promise<FileSystemFileHandle[]> }).showOpenFilePicker({
              types: [
                {
                  description: 'DesignForge Files',
                  accept: { 'application/json': ['.dfg', '.json'] },
                },
              ],
            });
            const file = await handle.getFile();
            const content = await file.text();
            const path = file.name;
            files.set(path, content);
            return path;
          } catch {
            return null; // User cancelled
          }
        }
        return null;
      },
      watch(path, cb) {
        if (!watchers.has(path)) watchers.set(path, new Set());
        watchers.get(path)!.add(cb);
        return () => {
          watchers.get(path)?.delete(cb);
        };
      },
    },
    theme: {
      get: () => theme,
      onChange(cb) {
        if (typeof window === 'undefined') return () => {};
        const mq = window.matchMedia('(prefers-color-scheme: dark)');
        const handler = (e: MediaQueryListEvent) => {
          theme = e.matches ? 'dark' : 'light';
          cb(theme);
        };
        mq.addEventListener('change', handler);
        return () => mq.removeEventListener('change', handler);
      },
    },
    shell: {
      open(url) {
        window.open(url, '_blank');
      },
      notify(msg) {
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('DesignForge', { body: msg });
        }
      },
      clipboard: {
        async read() {
          return navigator.clipboard.readText();
        },
        async write(s) {
          await navigator.clipboard.writeText(s);
        },
      },
    },
  };
}
