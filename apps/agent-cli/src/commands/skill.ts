import { defineCommand } from 'citty';
import { execSync } from 'node:child_process';
import os from 'node:os';
import path from 'node:path';
import chalk from 'chalk';

// ─── Provider shortcuts ─────────────────────────────────────

const PROVIDERS: Record<string, string> = {
  vercel: 'vercel-labs/agent-skills',
  anthropic: 'anthropics/skills',
};

const DEFAULT_PROVIDER = 'vercel';

function resolveRepo(input: string): string {
  // If it's a known shortcut, expand it
  if (PROVIDERS[input]) return PROVIDERS[input];
  // Otherwise assume it's owner/repo format
  return input;
}

function runNpxSkills(args: string, cwd: string): void {
  try {
    execSync(`npx -y skills ${args}`, {
      cwd,
      stdio: 'inherit',
      env: { ...process.env },
    });
  } catch {
    // npx skills already prints errors
  }
}

// ─── Subcommands ────────────────────────────────────────────

const list = defineCommand({
  meta: { name: 'list', description: 'List available skills from a provider' },
  args: {
    provider: {
      type: 'string',
      alias: 'p',
      default: DEFAULT_PROVIDER,
      description: `Provider shortcut: ${Object.keys(PROVIDERS).join(' | ')} or owner/repo (default: ${DEFAULT_PROVIDER})`,
    },
  },
  async run({ args }) {
    const repo = resolveRepo(String(args.provider));
    console.log(chalk.bold(`\n📦 Listing skills from ${repo}\n`));
    runNpxSkills(`add ${repo} --list`, process.cwd());
  },
});

const pull = defineCommand({
  meta: { name: 'pull', description: 'Pull a skill from a remote provider' },
  args: {
    name: {
      type: 'positional',
      description: 'Skill name (optional — omit to see all from provider)',
    },
    provider: {
      type: 'string',
      alias: 'p',
      default: DEFAULT_PROVIDER,
      description: `Provider: ${Object.keys(PROVIDERS).join(' | ')} or owner/repo`,
    },
    global: {
      type: 'boolean',
      alias: 'g',
      default: false,
      description: 'Install globally (~/.agents/) instead of workspace',
    },
    all: {
      type: 'boolean',
      default: false,
      description: 'Install all skills from the provider',
    },
  },
  async run({ args }) {
    const repo = resolveRepo(String(args.provider));
    const skillName = args.name ? String(args.name) : '';
    const isGlobal = Boolean(args.global);
    const installAll = Boolean(args.all);

    const flags: string[] = ['-y'];
    if (isGlobal) flags.push('--global');
    if (skillName) flags.push(`--skill ${skillName}`);
    if (installAll) flags.push('--all');

    console.log(chalk.bold(`\n📥 Pulling from ${repo}\n`));
    if (skillName) console.log(chalk.dim(`  Skill: ${skillName}`));
    if (isGlobal) console.log(chalk.dim(`  Scope: global`));
    console.log();

    runNpxSkills(`add ${repo} ${flags.join(' ')}`, process.cwd());

    console.log(chalk.dim(`\n  Run \`agent-cli sync\` to sync to your IDEs.\n`));
  },
});

const find = defineCommand({
  meta: { name: 'find', description: 'Search for skills interactively' },
  args: {
    query: {
      type: 'positional',
      description: 'Search query',
    },
  },
  async run({ args }) {
    const query = args.query ? String(args.query) : '';
    runNpxSkills(`find ${query}`, process.cwd());
  },
});

const update = defineCommand({
  meta: { name: 'update', description: 'Update all installed skills' },
  async run() {
    console.log(chalk.bold('\n🔄 Updating skills\n'));
    runNpxSkills('update', process.cwd());
  },
});

const remove = defineCommand({
  meta: { name: 'remove', description: 'Remove installed skills' },
  args: {
    name: {
      type: 'positional',
      description: 'Skill name to remove',
    },
  },
  async run({ args }) {
    const name = args.name ? String(args.name) : '';
    runNpxSkills(`remove ${name}`, process.cwd());
  },
});

// ─── Main Skill Command ─────────────────────────────────────

export default defineCommand({
  meta: {
    name: 'skill',
    description: 'Manage skills — powered by npx skills (vercel-labs)',
  },
  subCommands: {
    list: () => list,
    pull: () => pull,
    find: () => find,
    update: () => update,
    remove: () => remove,
  },
});
