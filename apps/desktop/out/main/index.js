import { app, BrowserWindow, nativeTheme, ipcMain, dialog, shell } from "electron";
import { join } from "path";
import { readFile, writeFile } from "fs/promises";
import { is } from "@electron-toolkit/utils";
import __cjs_mod__ from "node:module";
const __filename = import.meta.filename;
const __dirname = import.meta.dirname;
const require2 = __cjs_mod__.createRequire(import.meta.url);
let mainWindow = null;
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 1024,
    minHeight: 600,
    title: "DesignForge",
    backgroundColor: "#1a1a2e",
    titleBarStyle: process.platform === "darwin" ? "hiddenInset" : "default",
    trafficLightPosition: { x: 16, y: 16 },
    webPreferences: {
      preload: join(__dirname, "../preload/index.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false
    },
    show: false
  });
  mainWindow.on("ready-to-show", () => {
    mainWindow?.show();
    mainWindow?.focus();
  });
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: "deny" };
  });
  if (is.dev && process.env["ELECTRON_RENDERER_URL"]) {
    mainWindow.loadURL(process.env["ELECTRON_RENDERER_URL"]);
  } else {
    mainWindow.loadFile(join(__dirname, "../renderer/index.html"));
  }
}
function setupIPC() {
  ipcMain.handle("fs:read", async (_event, path) => {
    return readFile(path, "utf-8");
  });
  ipcMain.handle("fs:write", async (_event, path, content) => {
    await writeFile(path, content, "utf-8");
  });
  ipcMain.handle("fs:pick", async (_event, filters) => {
    const result = await dialog.showOpenDialog(mainWindow, {
      filters: filters?.length ? [{ name: "DesignForge", extensions: filters }] : [
        { name: "DesignForge Files", extensions: ["dfg"] },
        { name: "JSON Files", extensions: ["json"] },
        { name: "All Files", extensions: ["*"] }
      ],
      properties: ["openFile"]
    });
    return result.canceled ? null : result.filePaths[0];
  });
  ipcMain.handle("fs:save-dialog", async (_event) => {
    const result = await dialog.showSaveDialog(mainWindow, {
      filters: [
        { name: "DesignForge Files", extensions: ["dfg"] },
        { name: "JSON Files", extensions: ["json"] }
      ]
    });
    return result.canceled ? null : result.filePath;
  });
  ipcMain.handle("theme:get", () => {
    return nativeTheme.shouldUseDarkColors ? "dark" : "light";
  });
  ipcMain.handle("shell:open", (_event, url) => {
    shell.openExternal(url);
  });
  ipcMain.handle("window:minimize", () => mainWindow?.minimize());
  ipcMain.handle("window:maximize", () => {
    if (mainWindow?.isMaximized()) {
      mainWindow.unmaximize();
    } else {
      mainWindow?.maximize();
    }
  });
  ipcMain.handle("window:close", () => mainWindow?.close());
  ipcMain.handle("app:version", () => app.getVersion());
  ipcMain.handle("app:name", () => app.getName());
}
app.whenReady().then(() => {
  setupIPC();
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
nativeTheme.on("updated", () => {
  mainWindow?.webContents.send(
    "theme:changed",
    nativeTheme.shouldUseDarkColors ? "dark" : "light"
  );
});
