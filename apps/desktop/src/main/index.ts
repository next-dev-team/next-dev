/**
 * DesignForge Desktop — Electron Main Process
 *
 * Responsibilities:
 * 1. Create the BrowserWindow with the editor-ui renderer
 * 2. Expose file system IPC handlers for the HostAdapter
 * 3. Handle native menu, window state, OS integration
 * 4. Spawn MCP server as child process
 */

import { app, BrowserWindow, ipcMain, dialog, shell, nativeTheme, Menu } from 'electron';
import { join } from 'node:path';
import { readFile, writeFile } from 'node:fs/promises';
import { watch, type FSWatcher } from 'node:fs';
import { is } from '@electron-toolkit/utils';
import { setupMCPIPC } from './mcp-client';

let mainWindow: BrowserWindow | null = null;

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 1024,
    minHeight: 600,
    title: 'DesignForge',
    backgroundColor: '#1a1a2e',
    titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : 'default',
    trafficLightPosition: { x: 16, y: 16 },
    webPreferences: {
      preload: join(__dirname, '../preload/index.mjs'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
    show: false,
  });

  // Graceful show after content loads
  mainWindow.on('ready-to-show', () => {
    mainWindow?.show();
    mainWindow?.focus();
  });

  // Open external links in browser
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  // Load renderer
  if (is.dev && process.env.ELECTRON_RENDERER_URL) {
    mainWindow.loadURL(process.env.ELECTRON_RENDERER_URL);
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'));
  }
}

// ─── IPC Handlers ─────────────────────────────────────────────────────────

function setupIPC(): void {
  // File System
  ipcMain.handle('fs:read', async (_event, path: string) => {
    return readFile(path, 'utf-8');
  });

  ipcMain.handle('fs:write', async (_event, path: string, content: string) => {
    await writeFile(path, content, 'utf-8');
  });

  ipcMain.handle('fs:pick', async (_event, filters?: string[]) => {
    const result = await dialog.showOpenDialog(mainWindow!, {
      filters: filters?.length
        ? [{ name: 'DesignForge', extensions: filters }]
        : [
            { name: 'DesignForge Files', extensions: ['dfg'] },
            { name: 'JSON Files', extensions: ['json'] },
            { name: 'All Files', extensions: ['*'] },
          ],
      properties: ['openFile'],
    });
    return result.canceled ? null : result.filePaths[0];
  });

  ipcMain.handle('fs:save-dialog', async (_event) => {
    const result = await dialog.showSaveDialog(mainWindow!, {
      filters: [
        { name: 'DesignForge Files', extensions: ['dfg'] },
        { name: 'JSON Files', extensions: ['json'] },
      ],
    });
    return result.canceled ? null : result.filePath;
  });

  // Theme
  ipcMain.handle('theme:get', () => {
    return nativeTheme.shouldUseDarkColors ? 'dark' : 'light';
  });

  // Shell
  ipcMain.handle('shell:open', (_event, url: string) => {
    shell.openExternal(url);
  });

  // Window
  ipcMain.handle('window:minimize', () => mainWindow?.minimize());
  ipcMain.handle('window:maximize', () => {
    if (mainWindow?.isMaximized()) {
      mainWindow.unmaximize();
    } else {
      mainWindow?.maximize();
    }
  });
  ipcMain.handle('window:close', () => mainWindow?.close());

  // App info
  ipcMain.handle('app:version', () => app.getVersion());
  ipcMain.handle('app:name', () => app.getName());

  // ─── Live File Watcher ───────────────────────────────────────────────
  //
  // Watches a .dfg file for changes (written by MCP server with --file flag).
  // When the file changes, reads it and pushes the new spec to the renderer.

  let fileWatcher: FSWatcher | null = null;
  let watchedPath: string | null = null;

  ipcMain.handle('watch:start', async (_event, filePath: string) => {
    // Stop any existing watcher
    if (fileWatcher) {
      fileWatcher.close();
      fileWatcher = null;
    }

    watchedPath = filePath;
    let debounceTimer: ReturnType<typeof setTimeout> | null = null;

    try {
      fileWatcher = watch(filePath, (_eventType) => {
        // Debounce rapid writes (MCP may write multiple times quickly)
        if (debounceTimer) clearTimeout(debounceTimer);
        debounceTimer = setTimeout(async () => {
          try {
            const content = await readFile(filePath, 'utf-8');
            const parsed = JSON.parse(content);
            if (parsed.spec) {
              mainWindow?.webContents.send('watch:spec-changed', parsed.spec);
            }
          } catch {
            // File may be mid-write, ignore
          }
        }, 100);
      });

      console.log(`[Watch] Watching ${filePath} for live MCP changes`);
      return { success: true };
    } catch (err) {
      return { success: false, error: (err as Error).message };
    }
  });

  ipcMain.handle('watch:stop', () => {
    if (fileWatcher) {
      fileWatcher.close();
      fileWatcher = null;
      console.log(`[Watch] Stopped watching ${watchedPath}`);
      watchedPath = null;
    }
    return { success: true };
  });

  ipcMain.handle('watch:status', () => {
    return { watching: !!fileWatcher, path: watchedPath };
  });
}

// ─── App Lifecycle ────────────────────────────────────────────────────────

app.whenReady().then(() => {
  // Build an application menu with Edit roles so native clipboard shortcuts
  // (Ctrl/Cmd + C/V/X/A) work inside the BrowserWindow.
  const template: Electron.MenuItemConstructorOptions[] = [
    ...(process.platform === 'darwin'
      ? [{ label: app.getName(), submenu: [{ role: 'quit' as const }] }]
      : []),
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' as const },
        { role: 'redo' as const },
        { type: 'separator' as const },
        { role: 'cut' as const },
        { role: 'copy' as const },
        { role: 'paste' as const },
        { role: 'selectAll' as const },
      ],
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' as const },
        { role: 'toggleDevTools' as const },
        { type: 'separator' as const },
        { role: 'resetZoom' as const },
        { role: 'zoomIn' as const },
        { role: 'zoomOut' as const },
        { role: 'togglefullscreen' as const },
      ],
    },
  ];
  Menu.setApplicationMenu(Menu.buildFromTemplate(template));

  setupIPC();
  setupMCPIPC();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Listen for theme changes
nativeTheme.on('updated', () => {
  mainWindow?.webContents.send(
    'theme:changed',
    nativeTheme.shouldUseDarkColors ? 'dark' : 'light',
  );
});
