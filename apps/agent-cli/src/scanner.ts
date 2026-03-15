import fs from 'node:fs/promises';
import path from 'node:path';
import glob from 'fast-glob';
import matter from 'gray-matter';
import type { AgentsConfig, McpServer, Skill, Workflow } from './types.js';

/** Read a file if it exists, return null otherwise */
async function readFileOrNull(filePath: string): Promise<string | null> {
  try { return await fs.readFile(filePath, 'utf-8'); } catch { return null; }
}

/**
 * Scan a .agents directory and return all config.
 * Reads: AGENTS.md, SKILLS.md, skills/*, workflows/*
 */
export async function scanAgentsDir(agentsDir: string): Promise<AgentsConfig> {
  const config: AgentsConfig = {
    agentsmd: null,
    skillsmd: null,
    skills: [],
    workflows: [],
    mcpServers: {},
  };

  try { await fs.access(agentsDir); } catch { return config; }

  // Root-level files
  config.agentsmd = await readFileOrNull(path.join(agentsDir, 'AGENTS.md'));
  config.skillsmd = await readFileOrNull(path.join(agentsDir, 'SKILLS.md'));

  // MCP servers
  const mcpRaw = await readFileOrNull(path.join(agentsDir, 'mcp.json'));
  if (mcpRaw) {
    try {
      const parsed = JSON.parse(mcpRaw);
      config.mcpServers = parsed.mcpServers ?? parsed ?? {};
    } catch {
      // Invalid JSON — skip
    }
  }

  // Skills
  const skillFiles = await glob('skills/*/SKILL.md', { cwd: agentsDir });
  for (const rel of skillFiles) {
    const abs = path.join(agentsDir, rel);
    const raw = await fs.readFile(abs, 'utf-8');
    const { data, content } = matter(raw);
    const name = path.basename(path.dirname(rel));
    config.skills.push({
      name: data.name ?? name,
      description: data.description ?? '',
      content: content.trim(),
      filePath: abs,
    });
  }

  // Workflows
  const workflowFiles = await glob('workflows/*.md', { cwd: agentsDir });
  for (const rel of workflowFiles) {
    const abs = path.join(agentsDir, rel);
    const raw = await fs.readFile(abs, 'utf-8');
    const { data, content } = matter(raw);
    config.workflows.push({
      name: path.basename(rel, '.md'),
      description: data.description ?? '',
      content: content.trim(),
      filePath: abs,
    });
  }

  return config;
}

/**
 * Merge multiple configs (e.g. global + workspace).
 * Workspace values override global ones.
 */
export function mergeConfigs(...configs: AgentsConfig[]): AgentsConfig {
  const skillMap = new Map<string, Skill>();
  const workflowMap = new Map<string, Workflow>();
  let agentsmd: string | null = null;
  let skillsmd: string | null = null;
  let mcpServers: Record<string, McpServer> = {};

  for (const cfg of configs) {
    if (cfg.agentsmd) agentsmd = cfg.agentsmd;
    if (cfg.skillsmd) skillsmd = cfg.skillsmd;
    mcpServers = { ...mcpServers, ...cfg.mcpServers };
    for (const s of cfg.skills) skillMap.set(s.name, s);
    for (const w of cfg.workflows) workflowMap.set(w.name, w);
  }

  return {
    agentsmd,
    skillsmd,
    skills: [...skillMap.values()],
    workflows: [...workflowMap.values()],
    mcpServers,
  };
}
