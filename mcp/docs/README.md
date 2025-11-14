# MCP Local Docs Server

Overview

- TypeScript MCP server exposing local documentation features with stdio transport.
- Scans the repository and updates `c:\Users\MT-Staff\Documents\GitHub\next-dev\docs`.

Features

- Tools
  - `search-docs`: Search files in `docs` for a query string; returns matching file paths.
  - `update-docs`: Scan the repo and write a markdown overview to `docs/readme.md`.
- Transport
  - Uses `StdioServerTransport` from `@modelcontextprotocol/sdk` for IDE/client integration.

Requirements

- Node `>=20.11.0`
- pnpm (workspace-enabled)

Install

- From repo root: `pnpm i`
- Or locally: `cd mcp/server && pnpm i`

Run (stdio)

- From repo root: `pnpm --filter mcp-local-docs-server dev`
- Or in folder: `pnpm dev`
- Build: `pnpm build`
- Start: `pnpm start`

Integrate with MCP Inspector (CLI)

- Build: `pnpm build`
- Run Inspector CLI against the built stdio server:
  - `npx @modelcontextprotocol/inspector --cli node dist/index.js`

Example mcp.json (stdio)

```
{
  "mcpServers": {
    "local-docs": {
      "command": "node",
      "args": ["dist/index.js"],
      "env": {}
    }
  }
}
```

Tools Reference

- `search-docs` input
  - `query`: string
- `search-docs` output
  - `matches`: string[]
- `update-docs` input
  - `targetDir` (optional): string path; defaults to repo `docs`
- `update-docs` output
  - `updatedFiles`: string[]
  - `summary`: string

Notes

- Workspace inclusion is configured in `pnpm-workspace.yaml` with `mcp/*`.
- Server entry point: `mcp/server/src/index.ts`.
