# AGENTS.md

This file provides guidance when working with code in this repository.

## Project Overview

This is a JavaScript/TypeScript monorepo for open-source UI components and developer tooling. It includes:

- Apps: Ant Design Pro (web UI), Electron, Next.js, documentation site, component showcase
- Packages: configs, a component registry, utilities, reusable React Native components
- Strict unified scripts and style guidelines with pnpm for package management
- Emphasis on cross-platform UI and developer workflow tools

## Development Commands

Common scripts in each app/package:

- `pnpm install` – Install dependencies
- `pnpm build` – Run build
- `pnpm test` – Run tests
- `pnpm run lint` – Run linter
See each package’s README for details.

## Architecture

- Modular: Each app/package is separated for web, electron, registry, utilities, etc.
- Shared code: Utilities, configs, and components are reused across projects
- Strict lint/typecheck: Ensures quality and consistency
- Uses pnpm with workspace for fast, consistent package management

## Code Style and Best Practices

- TypeScript strict mode and workspace-wide lint/type rules
- Single quotes, trailing commas, organized imports (see .eslintrc, prettier, biome, etc.)
- Prefer async/await, throw on errors, suffix classes by type
- Naming: PascalCase for types/classes, camelCase for functions/variables

## Testing & Release

- Each package/app uses Vitest or appropriate test framework
- Tests in `__tests__` or `*.test.ts(x)` files
- Run tests and ensure passing before build or release
- Release: Use pnpm scripts for versioning, changelog, and publish

## Misc

- Node.js v18+ required, managed by Volta
- Refer to agent and contributing guides for advanced workflow
