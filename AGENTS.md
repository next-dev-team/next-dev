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

> **⚠️ MANDATORY**: The desktop app (`apps/desktop`) is an **Electron.js** application. All E2E and UI testing MUST go through MCP Playwright — **never open a browser**.

### ✅ DO

- Use **MCP Playwright** tools for all UI testing and interaction:
  - `mcp_playwright_browser_navigate` — navigate to pages
  - `mcp_playwright_browser_snapshot` — inspect DOM and find element refs (preferred over screenshots)
  - `mcp_playwright_browser_click`, `mcp_playwright_browser_type`, `mcp_playwright_browser_fill_form` — interact with elements
  - `mcp_playwright_browser_console_messages`, `mcp_playwright_browser_network_requests` — debug issues
- Navigate to `http://localhost:5173/` (Electron renderer process) for UI testing
- Run `pnpm run dev` from the monorepo root before testing
- **Save all screenshots to `.playwright-tmp/`** — this directory is gitignored. Use the `filename` parameter with a path prefix:
  - Example: `filename: '.playwright-tmp/my_screenshot.png'`
  - Or use `mcp_playwright_browser_run_code` with `path: '.playwright-tmp/screenshot.png'`

### ❌ DON'T

- **Never use `browser_subagent`** — it opens a separate browser and cannot attach to the Electron app
- **Never open a standalone browser window** for testing — always test through MCP Playwright against localhost:5173
- **Never use screenshots as the primary inspection method** — use `mcp_playwright_browser_snapshot` instead for DOM/accessibility tree
- **Never save screenshots to the project root** — always use `.playwright-tmp/` directory to avoid polluting the repo with test artifacts
