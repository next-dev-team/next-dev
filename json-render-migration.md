# json-render Migration Notes

This repo can move further onto `json-render`, but not by deleting the current custom renderer package in one pass.

## Current status

Already using upstream packages:

- `@json-render/core`
- `@json-render/react-native`
- `@json-render/codegen`

Not yet using upstream runtime/integration packages:

- `@json-render/react`
- `@json-render/mcp`
- `@json-render/zustand`
- `@json-render/redux`

## What maps cleanly

- The DesignForge document shape is already close to `json-render` spec format: `root`, `elements`, and `state`.
- `packages/catalog/src/json-render.ts` already defines the active catalog with `defineCatalog(...)`.
- `packages/catalog/src/json-render-registry.tsx` already defines a typed React Native registry with `defineRegistry(...)`.
- Code export already uses `@json-render/codegen`.

## What does not drop in yet

### Desktop runtime

`apps/desktop` renders a DOM-based editor canvas and chat preview through `@next-dev/json-render`, not through `@json-render/react` or `@json-render/react-native`.

That custom layer currently does three jobs that upstream does not replace by itself:

- DOM-friendly previews for React Native-oriented components
- editor-specific affordances like scaled previews and inline editing hooks
- chat previews from DesignForge operations rather than streamed json-render patches

### Editor metadata

DesignForge stores editor-only metadata on elements as `__editor` and keeps a top-level `version` field in the live document. Those fields are not part of the runtime json-render spec and need explicit stripping/rehydration at the boundary.

### AI flow

The current chat flow generates DesignForge operations (`add`, `remove`, `move`, `updateProps`), not json-render JSONL patches. Moving to the upstream streaming model means changing prompt format, parser logic, and preview application.

### MCP

`@json-render/mcp` is for MCP Apps style interactive UIs embedded inside MCP clients. That is useful, but it does not replace the current DesignForge mutation server in `packages/mcp-server`, which is centered on live document editing and desktop channel sync.

## Recommendation

### Adopt now

- Keep `@json-render/core`, `@json-render/react-native`, and `@json-render/codegen` as the canonical schema/catalog/export stack.
- Use the new interop helpers in `packages/catalog/src/json-render-interop.ts` whenever desktop/editor code needs to cross the DesignForge-spec <-> json-render-spec boundary.
- Prefer `@json-render/zustand` over Redux if we introduce json-render controlled state in the desktop app, because the repo already standardizes on Zustand.

### Do next

1. Introduce a web registry based on `@json-render/react` for non-editor previews.
2. Move chat preview generation from custom operation JSON to json-render JSONL patches.
3. Use `useJsonRenderMessage` / inline mode for conversational UI responses where text + UI should coexist.
4. Evaluate `@json-render/mcp` as a parallel MCP Apps surface, not as a replacement for the live DesignForge MCP server.

### Do not do yet

- Do not remove `@next-dev/json-render` until the desktop canvas overlays, selection model, and DOM preview strategy are separated from the renderer implementation.
- Do not add `@json-render/redux` unless a Redux store becomes a hard requirement. It does not match the current workspace state model.
