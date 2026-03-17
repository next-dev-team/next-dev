# Agents

This is a monorepo for React Native projects using UniWind (Tailwind v4 CSS-first) and NativeWind.

## Project Structure

- `apps/` — Runnable applications (expo apps, docs, CLI tools)
- `packages/` — Shared libraries (rn-uniwind, rn-nativewind)
- `.agents/` — Universal AI agent configuration

## Conventions

- Use **UniWind** (not NativeWind) for new components in `rn-uniwind`
- Components follow the `react-native-reusables` / shadcn pattern
- Path aliases: `~/` in packages, `@/` in apps
- Package manager: **pnpm**
- TypeScript everywhere

## Key Packages

| Package | Description |
|---------|-------------|
| `@next-dev/desktop` | DesignForge — Electron desktop app (`apps/desktop`) |
| `@next-dev/rn-uniwind` | UniWind-powered UI components |
| `@next-dev/rn-nativewind` | NativeWind UI components (legacy) |
| `@next-dev/agent-cli` | Sync .agents/ config to any IDE |

## Testing

> **IMPORTANT**: The desktop app (`apps/desktop`) is an **Electron.js** application.

- **Always use MCP Playwright** tools (`mcp_playwright_browser_navigate`, `mcp_playwright_browser_snapshot`, `mcp_playwright_browser_click`, etc.) for testing and interacting with the running app.
- **Never use `browser_subagent`** — it cannot attach to Electron windows.
- The dev server runs at `http://localhost:5173/` (renderer process). Use MCP Playwright to navigate to this URL for UI testing.
- Use `mcp_playwright_browser_snapshot` (not screenshots) as the primary way to inspect the page DOM and find interactive element refs.
- Use `mcp_playwright_browser_console_messages` and `mcp_playwright_browser_network_requests` for debugging.
- Start the app with `pnpm run dev:desktop` from the monorepo root before testing.
