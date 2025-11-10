# Tron Core Web

A web runtime and host UI for Tron plugins. This mirrors the Electron-based Tron Core but runs in the browser, loading plugin UIs via iframe URLs.

Features:

- Install plugins by URL (point to a built `index.html`)
- List installed plugins stored in `localStorage`
- Load/unload plugins into an iframe view
- Basic postMessage bridge skeleton (MessageChannel)

Notes:

- For security, only trusted origins should be allowed; see `web-security-manager.ts`.
- Uploading zipped plugins is not supported yet; use hosted URLs.
