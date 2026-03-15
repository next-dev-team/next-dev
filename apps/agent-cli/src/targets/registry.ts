import os from 'node:os';
import path from 'node:path';
import type { TargetDefinition, TargetName, AgentsConfig, GeneratedFile, Scope, DetectedTool, McpServer } from '../types.js';
import { pathExists } from '../utils/files.js';

function hasMcpServers(config: AgentsConfig): boolean {
  return Object.keys(config.mcpServers).length > 0;
}

function buildMcpJson(servers: Record<string, McpServer>): string {
  return JSON.stringify({ mcpServers: servers }, null, 2) + '\n';
}

// ─── Helpers ────────────────────────────────────────────────

function buildMdcFile(opts: { description: string; alwaysApply: boolean; globs?: string; content: string }): string {
  const lines = ['---', `description: ${opts.description}`];
  if (opts.globs) lines.push(`globs: ${opts.globs}`);
  lines.push(`alwaysApply: ${opts.alwaysApply}`, '---', '', opts.content);
  return lines.join('\n') + '\n';
}

/** Build a single markdown doc from all .agents content (for targets that use one file) */
function buildFullMarkdown(config: AgentsConfig, targetLabel: string): string {
  const parts: string[] = [];

  parts.push('<!-- Auto-generated from .agents/ by agent-cli. Do not edit. -->');
  parts.push(`<!-- Re-run: agent-cli sync --target ${targetLabel} -->\n`);

  // Include AGENTS.md content first (project-wide instructions)
  if (config.agentsmd) {
    parts.push(config.agentsmd.trim());
    parts.push('');
  }

  // Then each skill
  for (const skill of config.skills) {
    parts.push(`## Skill: ${skill.name}\n`);
    if (skill.description) parts.push(`> ${skill.description}\n`);
    parts.push(skill.content);
    parts.push('');
  }

  // Then each workflow
  for (const wf of config.workflows) {
    parts.push(`## Workflow: ${wf.name}\n`);
    if (wf.description) parts.push(`> ${wf.description}\n`);
    parts.push(wf.content);
    parts.push('');
  }

  return parts.join('\n') + '\n';
}

function buildCursorIndex(config: AgentsConfig): string {
  let body = '# Project Agent Configuration\n\n';
  body += 'Auto-generated from `.agents/` by agent-cli.\n\n';

  if (config.agentsmd) {
    body += config.agentsmd.trim() + '\n\n';
  }

  if (config.skills.length > 0) {
    body += '## Skills\n\n';
    body += config.skills.map((s) => `- **${s.name}**: ${s.description}`).join('\n') + '\n\n';
  }
  if (config.workflows.length > 0) {
    body += '## Workflows\n\n';
    body += config.workflows.map((w) => `- **${w.name}**: ${w.description}`).join('\n') + '\n\n';
  }

  body += '> Re-run `agent-cli sync --target cursor` to update.\n';
  return body;
}

// ─── Cursor ─────────────────────────────────────────────────

const cursor: TargetDefinition = {
  name: 'cursor',
  label: 'Cursor',
  implemented: true,
  supportedScopes: ['workspace'],
  defaultScope: 'workspace',
  detectPaths: (_home, cwd) => [path.join(cwd, '.cursor')],
  resolveOutputRoot: (_home, cwd, _scope) => path.join(cwd, '.cursor', 'rules'),
  gitignoreEntries: ['.cursor/'],
  generate(config, _scope) {
    const files: GeneratedFile[] = [];

    // AGENTS.md → always-apply project context rule
    if (config.agentsmd) {
      files.push({
        relativePath: '.cursor/rules/_project-context.mdc',
        content: buildMdcFile({
          description: 'Project context and conventions (from AGENTS.md)',
          alwaysApply: true,
          content: config.agentsmd.trim(),
        }),
        source: 'AGENTS.md',
      });
    }

    // Each skill → skills/ subfolder
    for (const skill of config.skills) {
      files.push({
        relativePath: `.cursor/rules/skills/${skill.name}.mdc`,
        content: buildMdcFile({ description: skill.description, alwaysApply: false, content: skill.content }),
        source: `skill: ${skill.name}`,
      });
    }

    // Each workflow → workflows/ subfolder
    for (const wf of config.workflows) {
      files.push({
        relativePath: `.cursor/rules/workflows/${wf.name}.mdc`,
        content: buildMdcFile({ description: wf.description, alwaysApply: false, content: wf.content }),
        source: `workflow: ${wf.name}`,
      });
    }

    // Index
    files.push({
      relativePath: '.cursor/rules/_project-agents.mdc',
      content: buildMdcFile({
        description: 'Project agent index (auto-generated)',
        alwaysApply: true,
        content: buildCursorIndex(config),
      }),
      source: 'project index',
    });

    // MCP servers
    if (hasMcpServers(config)) {
      files.push({
        relativePath: '.cursor/mcp.json',
        content: buildMcpJson(config.mcpServers),
        source: 'mcp.json',
      });
    }

    return files;
  },
};

// ─── Copilot ────────────────────────────────────────────────

const copilot: TargetDefinition = {
  name: 'copilot',
  label: 'GitHub Copilot',
  implemented: true,
  supportedScopes: ['workspace', 'global'],
  defaultScope: 'workspace',
  detectPaths: (home, cwd) => [
    path.join(cwd, '.github'),
    path.join(home, '.copilot'),
  ],
  resolveOutputRoot: (home, cwd, scope) =>
    scope === 'global' ? path.join(home, '.copilot') : path.join(cwd, '.github'),
  gitignoreEntries: ['.github/copilot-instructions.md'],
  generate(config, _scope) {
    const files: GeneratedFile[] = [{
      relativePath: '.github/copilot-instructions.md',
      content: buildFullMarkdown(config, 'copilot'),
      source: 'AGENTS.md + skills + workflows',
    }];
    if (hasMcpServers(config)) {
      files.push({
        relativePath: '.vscode/mcp.json',
        content: buildMcpJson(config.mcpServers),
        source: 'mcp.json',
      });
    }
    return files;
  },
};

// ─── Windsurf ───────────────────────────────────────────────

const windsurf: TargetDefinition = {
  name: 'windsurf',
  label: 'Windsurf',
  implemented: true,
  supportedScopes: ['workspace', 'global'],
  defaultScope: 'workspace',
  detectPaths: (home, cwd) => [
    path.join(cwd, '.windsurf'),
    path.join(home, '.codeium', 'windsurf'),
  ],
  resolveOutputRoot: (home, cwd, scope) =>
    scope === 'global' ? path.join(home, '.codeium', 'windsurf') : path.join(cwd, '.windsurf'),
  gitignoreEntries: ['.windsurf/'],
  generate(config, _scope) {
    const files: GeneratedFile[] = [{
      relativePath: '.windsurf/rules/agents.md',
      content: buildFullMarkdown(config, 'windsurf'),
      source: 'AGENTS.md + skills + workflows',
    }];
    if (hasMcpServers(config)) {
      files.push({
        relativePath: '.windsurf/mcp.json',
        content: buildMcpJson(config.mcpServers),
        source: 'mcp.json',
      });
    }
    return files;
  },
};

// ─── Gemini ─────────────────────────────────────────────────

const gemini: TargetDefinition = {
  name: 'gemini',
  label: 'Gemini',
  implemented: true,
  supportedScopes: ['workspace', 'global'],
  defaultScope: 'workspace',
  detectPaths: (home, cwd) => [
    path.join(cwd, '.gemini'),
    path.join(home, '.gemini'),
  ],
  resolveOutputRoot: (home, cwd, scope) =>
    scope === 'global' ? path.join(home, '.gemini') : path.join(cwd, '.gemini'),
  gitignoreEntries: [],
  generate(config, _scope) {
    const files: GeneratedFile[] = [{
      relativePath: '.gemini/agents.md',
      content: buildFullMarkdown(config, 'gemini'),
      source: 'AGENTS.md + skills + workflows',
    }];
    if (hasMcpServers(config)) {
      files.push({
        relativePath: '.vscode/mcp.json',
        content: buildMcpJson(config.mcpServers),
        source: 'mcp.json',
      });
    }
    return files;
  },
};

// ─── Claude ─────────────────────────────────────────────────

const claude: TargetDefinition = {
  name: 'claude',
  label: 'Claude Code',
  implemented: true,
  supportedScopes: ['workspace', 'global'],
  defaultScope: 'workspace',
  detectPaths: (home, cwd) => [
    path.join(cwd, '.claude'),
    path.join(home, '.claude'),
  ],
  resolveOutputRoot: (home, cwd, scope) =>
    scope === 'global' ? path.join(home, '.claude') : cwd,
  gitignoreEntries: ['CLAUDE.md', '.mcp.json'],
  generate(config, _scope) {
    const files: GeneratedFile[] = [{
      relativePath: 'CLAUDE.md',
      content: buildFullMarkdown(config, 'claude'),
      source: 'AGENTS.md + skills + workflows',
    }];
    if (hasMcpServers(config)) {
      files.push({
        relativePath: '.mcp.json',
        content: buildMcpJson(config.mcpServers),
        source: 'mcp.json',
      });
    }
    return files;
  },
};

// ─── Registry ───────────────────────────────────────────────

export const targets: TargetDefinition[] = [cursor, copilot, windsurf, gemini, claude];
export const targetNames = targets.map((t) => t.name);

export function isTargetName(value: string): value is TargetName {
  return targetNames.includes(value as TargetName);
}

export function getTarget(name: TargetName): TargetDefinition {
  const t = targets.find((t) => t.name === name);
  if (!t) throw new Error(`Unknown target: ${name}. Available: ${targetNames.join(', ')}`);
  return t;
}

/** Detect which tools are installed on this machine */
export async function detectInstalledTools(
  home = os.homedir(),
  cwd = process.cwd()
): Promise<DetectedTool[]> {
  const results: DetectedTool[] = [];

  for (const target of targets) {
    if (!target.implemented) continue;

    let detected = false;
    let reason = 'not found';

    for (const p of target.detectPaths(home, cwd)) {
      if (await pathExists(p)) {
        detected = true;
        reason = `found ${p}`;
        break;
      }
    }

    results.push({ name: target.name, label: target.label, detected, reason });
  }

  return results;
}
