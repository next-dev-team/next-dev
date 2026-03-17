# DesignForge - Direction, Product Spec, and Execution Plan

> Figma-like visual builder for React Native Reusables on UniWind.
> Chat-first editing, JSON-driven rendering, real RN code export.

---

## Direction Update

This plan supersedes two older assumptions:

- DesignForge should feel like a deep Figma-style editor shell, not a simple form builder.
- The repo is no longer greenfield. `editor-core`, `editor-ui`, `catalog`, `mcp-server`, `desktop`, `vscode`, and `agent-cli design` already exist as scaffolds or partial implementations.

The target is:

- Figma-like interaction model: left rail, layers, infinite canvas, inspector, keyboard-first workflows, pan/zoom, multi-select, layout tools.
- Vibe chat as a first-class surface: prompt, preview, accept, reject, branch, retry.
- `json-render` as the long-term document/render contract.
- `@next-dev/rn-uniwind` as the actual runtime output library.
- `apps/uniwind-expo` plus `pnpm dlx @react-native-reusables/cli@latest` as the official ingest path for new RNR components.

Important scope line:

- We are cloning the editor ergonomics of Figma, not the vector drawing engine of Figma.
- The document model remains component-native and layout-native, not freeform SVG/Bezier authoring.

---

## Product Thesis

DesignForge should let a developer do all of the following in one loop:

1. Prompt a screen into existence in chat.
2. Inspect and refine it visually in a Figma-like editor.
3. Edit props, layout, hierarchy, and variants without leaving the canvas.
4. Export or sync the result as real React Native code using `@next-dev/rn-uniwind`.

The win is not "another canvas app". The win is:

- structured UI data instead of pixels
- real RNR components instead of fake primitives
- UniWind classes and design tokens instead of ad hoc inline styling
- AI that speaks patches, not screenshots

---

## Current Repo State

### Already Present

`packages/editor-core`
- Document model
- History
- Selection
- Clipboard
- Vitest coverage

`packages/catalog`
- Zod-based component definitions
- Editor metadata
- Registry scaffolding

`packages/editor-ui`
- Toolbar
- Component palette
- Layer tree
- Canvas shell
- Props panel
- DnD plumbing
- Mock AI service abstraction

`packages/mcp-server`
- MCP server bootstrapped
- CRUD-style design tools over stdio

`apps/desktop`
- Electron shell scaffold

`apps/vscode`
- VS Code custom editor scaffold

`apps/agent-cli`
- `design` command exists with `generate`, `export`, `list`, and `preview`

### Current Gaps

- `json-render` is planned but not yet integrated into the actual codepaths.
- `packages/catalog` currently knows about more components than `@next-dev/rn-uniwind` exports.
- `@next-dev/rn-uniwind` currently exports only a small subset of the components needed by the builder.
- `editor-ui` has AI service plumbing but does not yet expose a real chat dock and patch review UX.
- `mcp-server` is still in-memory and not yet sessioned around real `.dfg` files.
- Desktop and VS Code hosts are scaffolds, not end-to-end product surfaces yet.

This means the next phase is not "start from zero". It is "close parity gaps, then turn the scaffolds into a coherent product".

---

## Deep-Clone Target

DesignForge should visually and behaviorally borrow from:

- Figma for the editor shell and interaction grammar
- Framer for polished canvas ergonomics
- Lovable / v0 for the chat-native generation loop

### Shell Layout

- Left rail: files, pages, assets, insert, layers
- Top toolbar: select, hand, frame preset, add component, undo/redo, zoom, platform preview
- Center: infinite canvas with artboards/frames and overlays
- Right inspector: design, layout, props, variants, export
- Right dock or bottom dock: persistent AI chat
- Bottom status bar: zoom, platform, branch/version, unsaved status

### Figma-Like Behaviors We Do Want

- Pan with spacebar or middle mouse
- Zoom to cursor
- Marquee multi-select
- Keyboard shortcuts for duplicate, group, ungroup, delete, nudge
- Resizable panels
- Frames/pages as first-class concepts
- Layer locking, hiding, collapse state
- Selection outlines and insertion indicators
- Command palette and slash insert

### Figma Behaviors We Do Not Need In V1

- Pen tool
- Bezier editing
- Vector boolean ops
- Bitmap editing
- Asset pipeline management

The result should feel like "Figma for structured React Native UI", not "Figma but worse".

---

## Core Technical Bet

The document source of truth should be a structured JSON tree that can power:

- canvas rendering
- prop editing
- AI patch generation
- export to RN code
- host interoperability

### Canonical Model

Use a `.dfg` file that wraps:

- a `json-render` compatible spec
- editor-only metadata
- host/session metadata

Example shape:

```json
{
  "version": 2,
  "catalog": "rnr-uniwind-v1",
  "targets": ["ios", "android", "web"],
  "spec": {
    "root": "frame-home",
    "elements": {
      "frame-home": {
        "type": "Frame",
        "props": {
          "name": "Home",
          "platform": "universal",
          "className": "flex-1 bg-background p-4 gap-4"
        },
        "children": ["card-1"]
      },
      "card-1": {
        "type": "Card",
        "props": {
          "className": null
        },
        "children": ["title-1", "body-1"]
      }
    },
    "state": {}
  },
  "editor": {
    "selectedIds": [],
    "expandedLayers": ["frame-home"],
    "viewport": {
      "zoom": 1,
      "x": 0,
      "y": 0
    }
  }
}
```

### Design Principle

- `editor-core` owns mutations, validation, history, and selection.
- Hosts and AI clients never mutate the document directly.
- Every mutation becomes a labeled operation or patch batch.
- Export strips editor metadata and emits real RN code.

---

## json-render Strategy

`json-render` should become the contract between:

- the visual canvas
- the AI layer
- future code generation

### Why It Fits

- It gives us a stable spec format instead of custom one-off JSON.
- It makes renderer, schema, and codegen composable.
- It gives the AI a constrained vocabulary.
- It makes host portability easier because the document stays headless.

### Adoption Plan

Short term:

- Keep current `editor-core` document primitives.
- Introduce an adapter layer that maps current spec shape to the `json-render` shape we want to standardize on.

Mid term:

- Integrate `@json-render/core`
- Integrate `@json-render/react`
- Integrate `@json-render/zustand`
- Integrate `@json-render/codegen`

Long term:

- Remove redundant custom rendering code once `json-render` is the real runtime path.

---

## Component Source of Truth

This is the critical architectural rule:

- `packages/catalog` must only describe components that actually exist and export from `@next-dev/rn-uniwind`.

Right now that rule is violated. Fixing it is one of the first priorities.

### Official Ingest Workflow

Per the UniWind/RNR workflow in this repo:

1. Run the RNR CLI from `apps/uniwind-expo`, not from `packages/rn-uniwind`.
2. Use `@react-native-reusables/cli@latest`.
3. Copy or sync generated files into `packages/rn-uniwind`.
4. Fix aliases from `@/` to `~/`.
5. Export the components from `packages/rn-uniwind/src/index.ts`.
6. Only then update `packages/catalog`.

Commands:

```bash
cd apps/uniwind-expo
pnpm dlx @react-native-reusables/cli@latest add input label separator switch checkbox textarea tabs select popover tooltip
```

If needed:

```bash
pnpm dlx @react-native-reusables/cli@latest doctor
pnpm dlx @react-native-reusables/cli@latest add --overwrite input label separator
```

### First Required Component Wave

These should exist before the AI/canvas loop is considered credible:

- `Input`
- `Label`
- `Separator`
- `Textarea`
- `Checkbox`
- `Switch`
- `Select`
- `Popover`
- `Tabs`
- `Accordion`
- `Alert`
- `AlertDialog`
- `Avatar`
- `Skeleton`
- `Tooltip`

### Catalog Rules

- No hand-waving types in `catalog`.
- No components in AI prompts that do not render on canvas.
- No components in export that do not exist in `@next-dev/rn-uniwind`.
- Registry, catalog, AI prompt context, and export imports must stay in lockstep.

---

## UX Surface Plan

### 1. Canvas

The canvas should be an infinite workspace with frames, not a boxed preview card.

Needs:

- pan and zoom
- frame presets for phone/tablet/web
- center-on-selection
- multi-select overlays
- drop insertion markers
- snap lines later, not day one
- optional minimap later

### 2. Layers

The layers panel should feel close to Figma:

- page/frame tree
- collapse and expand
- drag to reorder or reparent
- show hidden/locked state
- inline rename
- selection sync with canvas

### 3. Inspector

The right inspector should unify:

- component props
- layout controls
- spacing and alignment
- UniWind className editing
- variant selection
- frame settings

The inspector is where "component-native" beats pixel tooling:

- edit props directly
- surface RNR variants as structured controls
- let advanced users drop to className when necessary

### 4. Insert Flow

There should be three insert paths:

- drag from components panel
- slash insert on canvas or layers
- prompt in chat

All three should land in the same document mutation pipeline.

---

## Vibe Chat Plan

Chat is not a side feature. It is a co-equal editing surface.

### Goals

- Prompt against the whole screen or current selection.
- Generate structure, not screenshots.
- Preview changes before commit.
- Let the user accept all, accept some, or reject all.
- Preserve a visible conversation per file.

### Chat UX

The chat panel should support:

- message thread
- suggested prompts
- mode switch: `Ask`, `Edit`, `Generate`, `Refactor`
- selection-aware prompting
- patch preview cards
- retry and branch
- apply/revert
- concise diff summaries

### Example Prompts

- "Turn this into a pricing screen with three tiers"
- "Make the selected card look more premium"
- "Add a settings section under the profile card"
- "Replace these buttons with tabs"
- "Convert this form to a mobile-first layout"

### AI Output Contract

The AI should return structured JSON, not freeform prose.

Example envelope:

```json
{
  "summary": "Added a settings section below the profile card.",
  "target": {
    "scope": "selection",
    "selectionIds": ["card-2"]
  },
  "operations": [
    {
      "type": "add",
      "parentId": "frame-home",
      "elementType": "Card",
      "props": {
        "className": "gap-3"
      }
    }
  ]
}
```

### Patch Review Requirement

Never silently apply AI edits in the final product.

The flow should be:

1. prompt
2. model returns operations
3. editor creates preview branch
4. user inspects highlighted changes
5. user accepts or rejects

This is the main difference between a toy prompt box and a real vibe-chat workflow.

---

## Host Architecture

Keep the host adapter model. Extend it.

### Required Interfaces

`HostAdapter`
- file system
- dialogs
- theme
- clipboard
- notifications
- preview window hooks

`AIAdapter`
- send prompt
- stream partial status
- return structured operation batches
- support cancel

`DesignSession`
- load/save `.dfg`
- autosave
- dirty tracking
- branch history
- chat thread persistence

### Host Responsibilities

Electron:

- local filesystem
- multi-window preview
- menu and shortcuts
- optional local MCP process

VS Code / Cursor / Windsurf:

- custom editor for `.dfg`
- webview host for editor UI
- extension-host bridge for files and commands
- reuse the same bundled `editor-ui`

CLI:

- batch generation
- export
- validation
- preview
- scripted design transformations later

MCP:

- remote or local AI entry point
- component catalog introspection
- file-backed editing
- host-neutral automation surface

---

## Package Responsibilities

### `packages/editor-core`

Owns:

- document schema helpers
- operations
- validation
- history
- selection
- clipboard
- import/export transforms

Next additions:

- frame/page concepts
- branchable preview state
- operation labels suitable for chat diffs
- stricter schema validation

### `packages/catalog`

Owns:

- component schemas
- editor metadata
- grouping and categorization
- AI prompt serialization
- runtime registry mapping

Next additions:

- generate catalog from actual exports where possible
- component capability metadata
- frame/screen primitives
- prop editors for variants and design tokens

### `packages/editor-ui`

Owns:

- full Figma-like shell
- canvas and overlays
- layers panel
- inspector
- chat panel
- keyboard shortcuts
- host-agnostic state wiring

Next additions:

- chat dock
- preview diff mode
- resizable panels
- frame presets
- command palette
- selection-scoped prompting

### `packages/mcp-server`

Owns:

- AI and automation tools
- file-backed document sessions
- catalog/context exposure
- deterministic edit endpoints

Next additions:

- real `.dfg` open/save
- session IDs
- patch preview responses
- export endpoints
- validation errors that map cleanly to UI

### `apps/desktop`

Owns:

- polished local product shell
- native open/save dialogs
- preview windows
- packaging and updates

### `apps/vscode`

Owns:

- `.dfg` custom editor
- IDE-native command surface
- integration with Cursor/Windsurf via VS Code compatibility

### `apps/agent-cli`

Owns:

- terminal-first workflows
- export and validation
- catalog listing
- scripted generation

Next additions:

- file validation
- migration command
- bridge to MCP-backed generation instead of heuristics

---

## Delivery Phases From Here

### Phase 0 - Parity and Foundations

- Expand `@next-dev/rn-uniwind` using `@react-native-reusables/cli@latest`
- Fix `catalog` to match exported runtime components
- Lock `.dfg` version 2 schema
- Add validation that catches catalog/registry/export drift
- Keep `editor-core` as the single mutation authority

Exit criteria:

- every catalog component renders
- every catalog component exports
- every catalog component is AI-addressable

### Phase 1 - Figma Shell

- Replace the current simple canvas layout with an infinite workspace
- Add frames/pages
- Add panel resizing
- Add better selection overlays
- Add marquee multi-select
- Add richer keyboard shortcuts

Exit criteria:

- the app feels like a serious editor even before AI is used

### Phase 2 - Chat-First Editing

- Add real chat panel in `editor-ui`
- Implement patch preview and accept/reject
- Scope prompts to selection or entire document
- Replace mock service with host-backed `AIAdapter`

Exit criteria:

- user can build and revise a screen mostly from chat without losing trust

### Phase 3 - json-render Runtime

- Introduce `@json-render/core`
- Introduce `@json-render/react`
- Route canvas rendering through the registry
- Introduce `@json-render/codegen` for cleaner export

Exit criteria:

- spec, canvas, AI, and export all speak one contract

### Phase 4 - Host Integration

- File-backed desktop editing
- VS Code custom editor wiring
- CLI integration with MCP-backed operations
- `.agents/mcp.json` sync improvements

Exit criteria:

- same document can move across desktop, IDE, CLI, and MCP

### Phase 5 - Product Polish

- starter templates
- design tokens
- version snapshots
- better previews
- onboarding
- gallery of generated examples

---

## Immediate Build Order

If work starts now, do this in order:

1. Expand `@next-dev/rn-uniwind` component coverage through the Expo app and RNR CLI.
2. Fix `packages/catalog` so it matches real exports only.
3. Add a proper `AIChatPanel` and chat state in `packages/editor-ui`.
4. Add preview-branch support in `editor-core` for accept/reject flows.
5. Make `mcp-server` operate on real `.dfg` files instead of only in-memory state.
6. Upgrade the canvas shell to frames plus infinite pan/zoom.
7. Integrate `json-render` as the rendering contract.
8. Replace heuristic CLI/AI generation with the same structured operations used everywhere else.

This order matters. Chat on top of broken component parity will fail. A Figma-like shell without patch review will feel cosmetic. `json-render` should land after the document boundaries are stable enough to adopt it cleanly.

---

## Success Criteria

DesignForge is on track when all of the following are true:

- A prompt can generate a believable mobile screen in under a minute.
- The result renders with real `@next-dev/rn-uniwind` components.
- The user can refine the result visually without leaving the editor.
- The user can inspect and accept AI changes as structured diffs.
- Exported code compiles without hand-editing for the supported component set.
- The same `.dfg` file opens in desktop, VS Code, CLI, and MCP flows.

---

## Non-Goals For V1

- NativeWind-first workflows
- vector illustration tooling
- freeform absolute-position design systems
- design token management across multiple remote sources
- multiplayer collaboration
- marketplace/plugin ecosystem

V1 should be opinionated:

- UniWind only
- RNR only
- structured component composition only

That constraint is what makes the builder exportable and AI-friendly.
