# Tron Core Development and Plugin System Guide

## Development Setup

Tron Core is an Electron-based application. To develop and test it properly, especially features involving Electron APIs, you must run it within the Electron environment rather than a browser preview. Browser previews may show errors like "Electron API not ready" because they lack the full Electron context.

### Prerequisites

- Node.js (version specified in `.nvmrc`)
- pnpm (for package management)

### Installation

1. Navigate to the project root: `/Users/zila/Documents/GitHub/next-dev`
2. Install dependencies: `pnpm install`

### Running in Development Mode

- To start the development server: `pnpm dev` (or the specific script in `package.json` for tron-core, likely `vite` or Electron dev script).
- This will launch the Electron app where you can interact with the full features, including plugin installation.

Note: In development mode, built-in plugins like the counter are automatically loaded from `apps/tron-counter-plugin`.

### Building for Production

- Run the build script: Check `package.json` for build commands, e.g., `pnpm build`.
- The built distribution will be in `dist/`, and plugins can be installed/accessed post-build.

## How Plugins Work

### Plugin Structure

A plugin is a directory containing:

- `package.json` with `tron-plugin` configuration.
- Entry point (e.g., `dist/plugin.js` or `src/plugin.ts`).
- For UI plugins: `dist/index.html` or similar.

### Loading Plugins

- **Built-in Plugins**: Loaded from `plugins/` directory in the app. In dev mode, additional plugins like counter are loaded from external paths.
- **External Plugins**: Installed via the app's UI or IPC by selecting a directory.

### Installing Plugins in the App

1. Run the Electron app in dev mode.
2. Use the app's interface to select and install plugins (via "Select Plugin Directory" dialog).
3. Once installed, plugins are stored in the database and loaded on startup.

### Plugin Lifecycle

- **Loading**: Manifest is read, module imported, initialized with API bridge.
- **UI Plugins**: Get their own BrowserWindow.
- **Unloading**: Remove from loaded map and database.

### Development Tips

- For testing plugin installation: Use the Electron app, not browser.
- If tron-core can't install plugins, ensure the IPC handlers are set up and database is initialized.
- After building dist, plugins are accessible in the packaged app.

For issues, check console logs in the Electron dev tools.
