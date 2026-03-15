---
name: rnr-reusables
description: How to add, manage, and update React Native Reusables (UniWind) components in the rn-uniwind package
---

# React Native Reusables — UniWind Components

This skill covers how to work with [react-native-reusables](https://reactnativereusables.com) components using **UniWind** (Tailwind v4 CSS-first) in this monorepo.

## Key Concepts

- **react-native-reusables** brings the shadcn/ui experience to React Native.
- This project uses **UniWind** (not NativeWind) for Tailwind CSS styling in React Native.
- UniWind uses Tailwind v4's CSS-first approach — **no `tailwind.config.js`** is needed.
- Components use `withUniwind` from `'uniwind'` instead of `cssInterop` from `'nativewind'`.

## Project Structure

```
packages/rn-uniwind/
├── components.json            # shadcn/ui CLI configuration
├── uniwind-types.d.ts         # Required for UniWind detection
├── package.json
├── tsconfig.json
├── src/
│   └── index.ts               # Package exports
└── reusables/
    ├── global.css              # Tailwind v4 CSS-first theme
    ├── lib/
    │   └── utils.ts            # cn() utility
    └── components/
        └── ui/                 # UI components from the registry
            ├── button.tsx
            ├── text.tsx
            ├── card.tsx
            ├── badge.tsx
            ├── dialog.tsx
            ├── icon.tsx
            └── native-only-animated-view.tsx
```

## Adding New Components

> [!IMPORTANT]
> The CLI's automatic UniWind detection **only works in a full Expo app**, not in a standalone library package. You must run the CLI from the `uniwind-expo` app.

### Step-by-step workflow

1. **Run the CLI from the Expo app** (it will auto-detect UniWind):

```bash
cd apps/uniwind-expo
pnpm dlx @react-native-reusables/cli@latest add <component-name>
```

You should see `ℹ Styling Library: Uniwind` in the output — this confirms UniWind detection is working.

2. **Copy the component files to the rn-uniwind package**:

```bash
cp apps/uniwind-expo/components/ui/<component>.tsx packages/rn-uniwind/reusables/components/ui/
```

3. **Fix import path aliases** — the expo app uses `@/` but rn-uniwind uses `~/`:

```bash
cd packages/rn-uniwind
find reusables/components/ui -name '*.tsx' -exec sed -i '' "s|from '@/components/|from '~/components/|g; s|from '@/lib/|from '~/lib/|g" {} +
```

4. **Update `src/index.ts`** to export the new component.

5. **Update `package.json`** if the component needs new dependencies (e.g., `@rn-primitives/*`).

### Batch add multiple components

```bash
# From apps/uniwind-expo:
pnpm dlx @react-native-reusables/cli@latest add accordion alert checkbox input label

# To add ALL components at once:
pnpm dlx @react-native-reusables/cli@latest add --all
```

### Overwrite existing components

```bash
pnpm dlx @react-native-reusables/cli@latest add --overwrite <component-name>
```

## Available Components

See the full list at: https://reactnativereusables.com/docs/components/accordion

Common components: `accordion`, `alert`, `alert-dialog`, `avatar`, `badge`, `button`, `card`, `checkbox`, `collapsible`, `context-menu`, `dialog`, `dropdown-menu`, `hover-card`, `input`, `label`, `menubar`, `popover`, `progress`, `radio-group`, `select`, `separator`, `skeleton`, `switch`, `tabs`, `text`, `textarea`, `toggle`, `toggle-group`, `tooltip`.

## Configuration Files

### `components.json`

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "./reusables/global.css",
    "baseColor": "neutral",
    "cssVariables": true
  },
  "aliases": {
    "components": "~/components",
    "utils": "~/lib/utils",
    "ui": "~/components/ui",
    "lib": "~/lib",
    "hooks": "~/hooks"
  },
  "iconLibrary": "lucide"
}
```

- `config: ""` — no `tailwind.config.js` (Tailwind v4 CSS-first)
- Aliases use `~/` prefix (not `@/`) for the rn-uniwind package

### `global.css` — Tailwind v4 CSS-First Theme

The theme uses `@import "tailwindcss"` and `@import "uniwind"` with `@theme` blocks and `oklch()` color values. Do not use the old `hsl(var(--xxx))` pattern.

### `uniwind-types.d.ts`

This file is **required** for the CLI to detect UniWind. It declares the light/dark themes:

```typescript
/// <reference types="uniwind/types" />
declare module 'uniwind' {
  export interface UniwindConfig {
    themes: readonly ['light', 'dark']
  }
}
export {}
```

## UniWind vs NativeWind — How to Tell

| Feature | UniWind ✅ | NativeWind ❌ |
|---------|-----------|--------------|
| Icon styling | `withUniwind(Component, {...})` | `cssInterop(Component, {...})` |
| Import | `from 'uniwind'` | `from 'nativewind'` |
| Config | No `tailwind.config.js` | Requires `tailwind.config.js` |
| CSS | `@import "uniwind"` in global.css | `@tailwind` directives |
| TW version | Tailwind v4 | Tailwind v3 |

If you see `cssInterop` or `nativewind` imports in rn-uniwind components, they are **wrong** — the NativeWind version was installed instead of UniWind.

## Troubleshooting

### CLI installs NativeWind versions instead of UniWind

This happens when running the CLI from `packages/rn-uniwind` directly. **Always run from `apps/uniwind-expo`** and copy files over.

### "Tailwind config not found" warning

This is a **false positive** when using Tailwind v4 CSS-first. The CLI checks for `tailwind.config.js` which doesn't exist in v4 projects. Ignore this warning.

### Verifying correct installation

After adding components, run:
```bash
grep -r "nativewind" packages/rn-uniwind/reusables/components/ui/
```
If any results appear, the wrong version was installed.

## Useful CLI Commands

```bash
# Diagnose setup issues
pnpm dlx @react-native-reusables/cli@latest doctor

# Initialize a new UniWind project from scratch
pnpm dlx @react-native-reusables/cli@latest init -t minimal-uniwind

# List available components
pnpm dlx @react-native-reusables/cli@latest add
# (without a component name, shows a multi-select prompt)
```

## References

- Docs: https://reactnativereusables.com/docs/installation
- Changelog (UniWind): https://reactnativereusables.com/docs/changelog#december-2025-uniwind-template
- CLI docs: https://reactnativereusables.com/docs/cli
- UniWind: https://uniwind.dev
