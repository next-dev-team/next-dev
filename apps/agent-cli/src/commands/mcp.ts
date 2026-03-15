import { defineCommand } from 'citty';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import chalk from 'chalk';
import type { McpServer } from '../types.js';

type McpFile = { mcpServers: Record<string, McpServer> };

async function loadMcpFile(filePath: string): Promise<McpFile> {
  try {
    const raw = await fs.readFile(filePath, 'utf-8');
    const parsed = JSON.parse(raw);
    return { mcpServers: parsed.mcpServers ?? parsed ?? {} };
  } catch {
    return { mcpServers: {} };
  }
}

async function saveMcpFile(filePath: string, data: McpFile): Promise<void> {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(data, null, 2) + '\n');
}

function resolveMcpPath(cwd: string, scope: string): string {
  return scope === 'global'
    ? path.join(os.homedir(), '.agents', 'mcp.json')
    : path.join(cwd, '.agents', 'mcp.json');
}

// ─── Subcommands ────────────────────────────────────────────

const list = defineCommand({
  meta: { name: 'list', description: 'List configured MCP servers' },
  args: {
    scope: {
      type: 'string',
      default: 'all',
      description: 'Scope: workspace | global | all (default: all)',
    },
  },
  async run({ args }) {
    const cwd = process.cwd();
    const home = os.homedir();
    const scope = String(args.scope);

    console.log(chalk.bold('\n◈ MCP Servers\n'));

    const show = (label: string, filePath: string, data: McpFile) => {
      const entries = Object.entries(data.mcpServers);
      if (entries.length === 0) return;
      console.log(chalk.bold(`  ${label}`) + chalk.dim(` (${filePath}):`));
      for (const [name, server] of entries) {
        const type = server.type ?? (server.command ? 'stdio' : 'http');
        const endpoint = server.url ?? server.command ?? '';
        console.log(`    ${chalk.magenta('◈')} ${chalk.white(name)}` + chalk.dim(` — ${type} ${endpoint}`));
      }
      console.log();
    };

    if (scope === 'all' || scope === 'global') {
      const gPath = path.join(home, '.agents', 'mcp.json');
      show('Global', '~/.agents/mcp.json', await loadMcpFile(gPath));
    }

    if (scope === 'all' || scope === 'workspace') {
      const wPath = path.join(cwd, '.agents', 'mcp.json');
      show('Workspace', '.agents/mcp.json', await loadMcpFile(wPath));
    }
  },
});

const add = defineCommand({
  meta: { name: 'add', description: 'Add an MCP server' },
  args: {
    name: {
      type: 'positional',
      required: true,
      description: 'Server name (e.g. context7)',
    },
    url: {
      type: 'string',
      description: 'HTTP URL for http-type MCP servers',
    },
    command: {
      type: 'string',
      description: 'Command for stdio-type MCP servers',
    },
    scope: {
      type: 'string',
      default: 'workspace',
      description: 'Where to save: workspace | global (default: workspace)',
    },
  },
  async run({ args }) {
    const cwd = process.cwd();
    const name = String(args.name);
    const scope = String(args.scope);
    const filePath = resolveMcpPath(cwd, scope);

    const data = await loadMcpFile(filePath);

    const server: McpServer = {};

    if (args.url) {
      server.type = 'http';
      server.url = String(args.url);
    } else if (args.command) {
      server.type = 'stdio';
      const parts = String(args.command).split(' ');
      server.command = parts[0];
      if (parts.length > 1) server.args = parts.slice(1);
    } else {
      console.error(chalk.red('\n  ✗ Provide --url or --command\n'));
      process.exit(1);
    }

    data.mcpServers[name] = server;
    await saveMcpFile(filePath, data);

    const displayPath = scope === 'global' ? '~/.agents/mcp.json' : '.agents/mcp.json';
    console.log(chalk.green(`\n  ✚ Added "${name}" to ${displayPath}\n`));
  },
});

const remove = defineCommand({
  meta: { name: 'remove', description: 'Remove an MCP server' },
  args: {
    name: {
      type: 'positional',
      required: true,
      description: 'Server name to remove',
    },
    scope: {
      type: 'string',
      default: 'workspace',
      description: 'Where to remove from: workspace | global (default: workspace)',
    },
  },
  async run({ args }) {
    const cwd = process.cwd();
    const name = String(args.name);
    const scope = String(args.scope);
    const filePath = resolveMcpPath(cwd, scope);

    const data = await loadMcpFile(filePath);

    if (!(name in data.mcpServers)) {
      console.log(chalk.yellow(`\n  ⚠ "${name}" not found in ${scope} mcp.json\n`));
      return;
    }

    delete data.mcpServers[name];
    await saveMcpFile(filePath, data);

    const displayPath = scope === 'global' ? '~/.agents/mcp.json' : '.agents/mcp.json';
    console.log(chalk.red(`\n  ✗ Removed "${name}" from ${displayPath}\n`));
  },
});

// ─── Main MCP Command ──────────────────────────────────────

export default defineCommand({
  meta: {
    name: 'mcp',
    description: 'Manage MCP server configurations',
  },
  subCommands: {
    list: () => list,
    add: () => add,
    remove: () => remove,
  },
});
