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
| `@next-dev/rn-uniwind` | UniWind-powered UI components |
| `@next-dev/rn-nativewind` | NativeWind UI components (legacy) |
| `@next-dev/agent-cli` | Sync .agents/ config to any IDE |
