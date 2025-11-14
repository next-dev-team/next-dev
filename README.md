# Repository Overview

Generated: 2025-11-15

## Project Brief

- A React + React Native monorepo delivering reusable UI, a docs site, showcase app, Electron desktop runtime, web runtime, and developer tooling.
- Built for cross‑platform consistency (mobile, web, desktop) with TypeScript, Turbo, and pnpm workspaces.

## Monorepo

- Package manager: pnpm 10.22.0
- Orchestrator: turbo ^2.6.1
- Node engines: >= 20.11.0

## Apps

- `apps/docs` — Next.js 15 + Fumadocs
- `apps/next16` — Next.js 16 + Tailwind v4
- `apps/tron-core` — Electron + React + Vite
- `apps/tron-core-web` — Vite + React
- `apps/showcase` — Expo React Native + NativeWind
- `apps/electron` — Electron packaging (electron-builder)
- `apps/cli` — TypeScript CLI (tsup/tsx)
- `apps/antd-pro` — Umi Max + Ant Design Pro

## Tooling

- TypeScript 5.x across apps
- ESLint + Prettier
- Testing: Vitest, Playwright
- Styling: Tailwind CSS, NativeWind, Ant Design

## Important Configs

- `apps/docs/next.config.mjs`
- `apps/next16/next.config.ts`
- `apps/tron-core/vite.config.ts`
- `apps/tron-core-web/vite.config.ts`
- `apps/showcase/app.config.ts`
- `apps/antd-pro/.umirc.ts`
- `package.json` (workspaces, engines)

## Features

- Reusable UI components with RN + NativeWind and web compatibility via `react-native-web`.
- Documentation site powered by Fumadocs with component registries and examples.
- Showcase app (Expo Router) demonstrating components on iOS/Android/Web.
- Electron desktop core (`tron-core`) with plugin‑based architecture and Vite renderer.
- Web runtime (`tron-core-web`) for running Tron plugins in the browser.
- CLI utilities for project scaffolding and registry tasks.
- Admin starter using Umi Max + Ant Design Pro.
- Turbo pipelines and caching for fast `dev`, `build`, `test`.
- Packaging for desktop via `electron-builder`.

## Monorepo Flow

- Install: `pnpm install` at the repo root.
- Develop all (Turbo): `pnpm dev`.
- Develop specific apps:
  - Docs: `pnpm dev:docs`
  - Web runtime: `pnpm dev:web`
  - Electron packaging app: `pnpm dev:electron`
  - Showcase (multi-target): `pnpm dev:showcase`, `pnpm dev:showcase:web`, `pnpm dev:showcase:android`
  - Tron Core: `pnpm dev:tron`
- Build:
  - All: `pnpm build`
  - Filtered: `pnpm build:docs`, `pnpm build:showcase`
- Lint: `pnpm lint` (fix: `pnpm lint:fix`)
- Test: `pnpm test`
- Clean: `pnpm clean`
- Postinstall hooks: automatically run via `turbo run postinstall` after install.

## Workspaces

- `@rnr/docs`, `@rnr/next16`, `@rnr/tron-core`, `@rnr/tron-core-web`, `@rnr/showcase`, `@rnr/electron`, `@rnr/ant-pro`, `@react-native-reusables/cli`.

## Related
- shadcn/ui — https://ui.shadcn.com • https://github.com/shadcn/ui
- React Native Reusables — https://github.com/founded-labs/react-native-reusables
