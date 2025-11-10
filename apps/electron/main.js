const { app, BrowserWindow } = require('electron');
const { spawn, fork } = require('child_process');
const net = require('net');
const path = require('path');

const DOCS_PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
const DOCS_URL = `http://localhost:${DOCS_PORT}`;
const REPO_ROOT = path.resolve(__dirname, '../..');
const RESOURCES_ROOT = process.resourcesPath ? process.resourcesPath : REPO_ROOT;

let docsProc = null;

function isPortOpen(port, host = '127.0.0.1') {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    socket.setTimeout(1000);
    socket.once('error', () => {
      socket.destroy();
      resolve(false);
    });
    socket.once('timeout', () => {
      socket.destroy();
      resolve(false);
    });
    socket.connect(port, host, () => {
      socket.end();
      resolve(true);
    });
  });
}

async function waitForServer(port, retries = 60, intervalMs = 500) {
  for (let i = 0; i < retries; i++) {
    const open = await isPortOpen(port);
    if (open) return true;
    await new Promise((r) => setTimeout(r, intervalMs));
  }
  return false;
}

function startDocsDev() {
  // If server already running, skip spawning
  return isPortOpen(DOCS_PORT).then((open) => {
    if (open) {
      console.log(`[electron] Docs server already running on ${DOCS_URL}`);
      return null;
    }
    console.log('[electron] Starting Next.js docs dev server...');
    // Use pnpm filter to start the docs app
    const proc = spawn(
      process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm',
      ['--filter', '@rnr/docs', 'dev'],
      {
        cwd: REPO_ROOT,
        stdio: ['ignore', 'pipe', 'pipe'],
        env: { ...process.env },
      },
    );
    proc.stdout.on('data', (data) => {
      process.stdout.write(`[next] ${data}`);
    });
    proc.stderr.on('data', (data) => {
      process.stderr.write(`[next] ${data}`);
    });
    proc.on('exit', (code) => {
      console.log(`[electron] Docs dev process exited with code ${code}`);
    });
    docsProc = proc;
    return proc;
  });
}

function startDocsProd() {
  // Start Next standalone server from extraResources when packaged
  const standaloneRoot = path.join(RESOURCES_ROOT, 'next');
  const serverJs = path.join(standaloneRoot, 'apps', 'docs', 'server.js');
  console.log('[electron] Starting Next.js docs production server...', serverJs);
  const proc = fork(serverJs, [], {
    cwd: standaloneRoot,
    env: { ...process.env, PORT: String(DOCS_PORT), ELECTRON_RUN_AS_NODE: '1' },
    silent: true,
  });
  proc.stdout.on('data', (data) => {
    process.stdout.write(`[next] ${data}`);
  });
  proc.stderr.on('data', (data) => {
    process.stderr.write(`[next] ${data}`);
  });
  proc.on('exit', (code) => {
    console.log(`[electron] Docs prod process exited with code ${code}`);
  });
  docsProc = proc;
  return proc;
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
    },
    autoHideMenuBar: true,
  });
  win.loadURL(DOCS_URL);
}

app.on('ready', async () => {
  try {
    if (app.isPackaged || process.env.NODE_ENV === 'production') {
      await startDocsProd();
    } else {
      await startDocsDev();
    }
    const ok = await waitForServer(DOCS_PORT);
    if (!ok) {
      console.error(`[electron] Failed to detect docs server on ${DOCS_URL}`);
    }
    createWindow();
  } catch (e) {
    console.error('[electron] Error during startup', e);
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  if (docsProc && !docsProc.killed) {
    docsProc.kill('SIGINT');
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
