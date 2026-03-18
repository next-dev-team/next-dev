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

> **⚠️ MANDATORY**: The desktop app (`apps/desktop`) is an **Electron.js** application. E2E tests use **Playwright's Electron support** (`_electron.launch()`) — **never open a standalone browser**.

### E2E Tests (Playwright + Electron)

Tests live in `apps/desktop/e2e/` and use custom fixtures from `e2e/fixtures.ts` that launch the real Electron app.

```bash
# Run all E2E tests (builds first, then launches Electron)
pnpm --filter @next-dev/desktop test:e2e

# Interactive Playwright UI mode
pnpm --filter @next-dev/desktop test:e2e:ui
```

- **Config**: `apps/desktop/playwright.config.ts`
- **Fixtures**: `apps/desktop/e2e/fixtures.ts` — provides `electronApp` and `window`
- Tests get a real `Page` from the Electron `BrowserWindow` — no `baseURL` or browser projects needed
- Build the app first (`electron-vite build`) before running tests

### Agent Ad-Hoc Testing (MCP Playwright)

For interactive AI-agent testing during development, use **MCP Playwright** tools against the dev server:

#### ✅ DO

- Use **MCP Playwright** for electronjs not browser