# @next-dev/agent-cli

**Universal AI agent config — write once in `.agents/`, sync to any IDE.**

```text
.agents/                  ← ONE source of truth (committed to git)
   ↓  agent-cli sync
┌──────────┬──────────┬───────────┬──────────┬───────────┐
│ Cursor   │ Copilot  │ Windsurf  │ Gemini   │ Claude    │
│ .mdc     │ .md      │ rules/    │ agents/  │ CLAUDE.md │
└──────────┴──────────┴───────────┴──────────┴───────────┘
```

## Why?

Every AI coding tool uses a different config format:

| Tool | Config Location | Format |
| --- | --- | --- |
| Cursor | `.cursor/rules/*.mdc` | MDC (Markdown + frontmatter) |
| GitHub Copilot | `.github/copilot-instructions.md` | Markdown |
| Windsurf | `.windsurf/rules/` | Markdown |
| Gemini | `.gemini/agents.md` | Markdown |
| Claude Code | `CLAUDE.md` + `.mcp.json` | Markdown + JSON |

**The problem:** You maintain the same instructions in 5 different places.

**The solution:** Write everything once in `.agents/`, run `agent-cli sync`, and every IDE gets the right format automatically.

## Install (Global)

No npm publish needed — symlink directly from source:

```bash
# One-time setup (from monorepo root)
ln -sf $(pwd)/apps/agent-cli/bin/agent-cli.js ~/.local/bin/agent-cli
```

Now `agent-cli` works from **any project** on your machine.

> Make sure `~/.local/bin` is in your `PATH`. If not, add `export PATH="$HOME/.local/bin:$PATH"` to your `~/.zshrc`.

## Quick Start

```bash
# 1. Initialize a new project
agent-cli init

# 2. Edit your config
#    .agents/AGENTS.md   — project instructions
#    .agentrc             — CLI settings (targets, scope, etc.)

# 3. Sync to your IDEs
agent-cli sync

# 4. Check status
agent-cli status
```

## The `.agents/` Directory

The **universal, IDE-agnostic format** — committed to git, shared across the team:

```text
.agents/
├── AGENTS.md              # Project-wide instructions (synced to root)
├── SKILLS.md              # Human-readable skills index (synced to root)
├── mcp.json               # MCP server definitions (synced to each IDE)
├── skills/
│   └── <skill-name>/
│       └── SKILL.md       # Skill definition (YAML frontmatter + markdown)
└── workflows/
    └── <workflow-name>.md # Workflow steps (YAML frontmatter + markdown)
```

### AGENTS.md

Project-wide instructions every AI agent should know — conventions, architecture, coding standards. Synced to project root and embedded in every IDE's config.

### SKILLS.md

Human-readable index of available skills. Synced to project root.

### mcp.json

MCP (Model Context Protocol) server definitions. Synced to each IDE's format:

| Source | Target |
| --- | --- |
| `.agents/mcp.json` | `.cursor/mcp.json` |
| `.agents/mcp.json` | `.vscode/mcp.json` (Copilot/Gemini) |
| `.agents/mcp.json` | `.windsurf/mcp.json` |
| `.agents/mcp.json` | `.mcp.json` (Claude Code) |

### Skills

Modular, focused instructions for specific tasks:

```text
.agents/skills/my-skill/
├── SKILL.md          # Required — main instructions
├── scripts/          # Optional — helper scripts
├── references/       # Optional — reference docs
└── assets/           # Optional — templates, examples
```

**SKILL.md format:**

```markdown
---
name: my-skill
description: Short description of what this skill does
---

# My Skill

Detailed instructions here...
```

### Workflows

Step-by-step procedures:

```markdown
---
description: How to deploy the application
---

1. Run `pnpm build`
2. Run `pnpm deploy`
```

## `.agentrc` Config

Project-level configuration at the repo root (like `.eslintrc`):

```json
{
  "$schema": "./apps/agent-cli/schema.json",
  "targets": ["cursor", "claude"],
  "scope": "workspace",
  "gitignore": true,
  "mcp": true,
  "rootFiles": ["AGENTS.md", "SKILLS.md"]
}
```

| Option | Default | Description |
| --- | --- | --- |
| `targets` | `[]` (auto-detect) | Explicit list of targets to sync |
| `scope` | `"workspace"` | Default scope for all targets |
| `gitignore` | `true` | Auto-manage `.gitignore` |
| `mcp` | `true` | Sync MCP server configs |
| `rootFiles` | `["AGENTS.md", "SKILLS.md"]` | Files to copy to project root |

CLI args always override `.agentrc`.

## Commands

### `agent-cli init`

Scaffold `.agents/` directory and `.agentrc` for a new project.

```bash
agent-cli init                    # Use directory name as project name
agent-cli init --name "My App"    # Custom project name
agent-cli init --force            # Overwrite existing files
```

Creates:

```text
.agentrc
.agents/
├── AGENTS.md
├── SKILLS.md
├── mcp.json
├── skills/
└── workflows/
```

### `agent-cli sync`

Sync `.agents/` config to IDE targets.

```bash
agent-cli sync                        # Sync to targets from .agentrc (or auto-detect)
agent-cli sync --target cursor        # Sync to a specific IDE
agent-cli sync --target all           # Force sync to all detected IDEs
agent-cli sync --dry-run              # Preview without writing
agent-cli sync --scope global         # Override scope
```

**What sync does:**

1. Reads global `~/.agents/` + workspace `.agents/` (workspace overrides global)
2. Copies `AGENTS.md` and `SKILLS.md` to project root
3. Generates IDE-specific configs (rules, instructions, MCP)
4. Auto-injects entries into `.gitignore`

### `agent-cli status`

Show current config, MCP servers, and detected IDEs.

```bash
agent-cli status
```

```text
📋 agent-cli status

  Global (~/.agents/):
    ● skill-creator — Guide for creating effective skills

  Workspace (.agents/):
    ● rnr-reusables — React Native Reusables management

  MCP Servers:
    ◈ context7 — http https://mcp.context7.com/mcp

  Detected IDEs:
    ✓ Cursor — found .cursor
    ✓ Claude Code — found ~/.claude
    ✗ Windsurf

  Config (.agentrc):
    targets:   cursor, claude
    scope:     workspace
    gitignore: true
```

### `agent-cli convert`

Import existing IDE configs into `.agents/` format.

```bash
agent-cli convert --from cursor                 # Cursor → .agents/ (workspace)
agent-cli convert --from cursor --scope global  # Cursor → ~/.agents/ (global)
agent-cli convert --from cursor --scope both    # Cursor → both
agent-cli convert --from cursor --dry-run       # Preview
```

### `agent-cli mcp`

Manage MCP server configurations.

```bash
agent-cli mcp list                                 # List all MCP servers
agent-cli mcp add context7 --url https://...       # Add HTTP server
agent-cli mcp add gh --command "npx server-github" # Add stdio server
agent-cli mcp remove context7                      # Remove a server
agent-cli mcp add x --url ... --scope global       # Save to ~/.agents/
```

## Global vs Workspace

Two levels of `.agents/` config:

| Level | Location | Use Case |
| --- | --- | --- |
| **Global** | `~/.agents/` | Skills you want in every project |
| **Workspace** | `.agents/` (project root) | Project-specific skills |

When syncing, **workspace overrides global** for skills with the same name.

## Generated Output

### Cursor

```text
.cursor/
├── mcp.json                           # MCP servers
└── rules/
    ├── _project-context.mdc           # AGENTS.md (alwaysApply: true)
    ├── _project-agents.mdc            # Skills index (alwaysApply: true)
    ├── skills/
    │   ├── skill-creator.mdc
    │   └── rnr-reusables.mdc
    └── workflows/
        └── deploy.mdc
```

### Other IDEs

Copilot, Windsurf, Gemini, and Claude generate a single markdown file + MCP config.

## Auto-Gitignore

Sync automatically manages `.gitignore` with marked blocks:

```gitignore
# >>> agent-cli (auto-generated, do not edit)
AGENTS.md
SKILLS.md
.cursor/
CLAUDE.md
.mcp.json
# <<< agent-cli
```

Generated outputs are gitignored — the source of truth is always `.agents/`.

## Monorepo Shortcuts

Available in root `package.json`:

```bash
pnpm init:cursor        # Sync .agents/ → .cursor/rules/
pnpm convert:cursor     # Import .cursor/rules/ → .agents/
pnpm agents:status      # Show config + detected IDEs
```

## Architecture

```text
apps/agent-cli/
├── bin/
│   └── agent-cli.js      # Global bin (shell script, tsx-based)
├── schema.json            # JSON Schema for .agentrc validation
├── src/
│   ├── index.ts           # CLI entry (citty subcommands)
│   ├── types.ts           # Core types
│   ├── scanner.ts         # Reads .agents/, merges global + workspace
│   ├── rc.ts              # Loads .agentrc config
│   ├── gitignore.ts       # Auto-inject .gitignore blocks
│   ├── commands/
│   │   ├── init.ts        # Scaffold .agents/ + .agentrc
│   │   ├── sync.ts        # .agents/ → IDE configs
│   │   ├── convert.ts     # IDE configs → .agents/
│   │   ├── status.ts      # Show config + detected tools
│   │   └── mcp.ts         # MCP server management
│   ├── targets/
│   │   └── registry.ts    # IDE target definitions
│   └── utils/
│       └── files.ts       # File system helpers
└── package.json
```

### Adding a New IDE Target

1. Add a `TargetDefinition` to `src/targets/registry.ts`
2. Define: `name`, `label`, `detectPaths`, `resolveOutputRoot`, `gitignoreEntries`, `generate()`
3. Add it to the `targets` array

That's it — the CLI will auto-detect it and include it in `sync --target all`.

## Development

```bash
# Run directly with tsx (no build needed)
npx tsx src/index.ts status
npx tsx src/index.ts sync --target cursor --dry-run

# Build for distribution
pnpm build

# Link globally (no npm publish)
ln -sf $(pwd)/bin/agent-cli.js ~/.local/bin/agent-cli
```

### Useful links

- <https://github.com/EveryInc/compound-engineering-plugin>