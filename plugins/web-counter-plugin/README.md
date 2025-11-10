# Web Counter Plugin

Simple React counter plugin designed to run under the Tron web host via iframe. Supports persistence via `pluginAPI.storage` if available, with a localStorage fallback.

## Scripts

- `pnpm --filter web-counter-plugin dev` – start dev server on `http://localhost:3004/`
- `pnpm --filter web-counter-plugin build` – build to `dist/`
- `pnpm --filter web-counter-plugin preview` – preview built assets on `http://localhost:3003/`

## Load in Tron Web Host

1. Run host: `pnpm --filter @rnr/tron-core-web dev` and open `http://localhost:5175/`.
2. Click the directory picker and select `apps/web-counter-plugin/dist`.
3. Click Load. The host serves the plugin under `/plugins/web-counter-plugin/index.html`.
4. Open browser console to confirm the handshake (`tron:hello`).