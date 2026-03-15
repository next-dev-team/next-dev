import { describe, it, expect, beforeAll } from 'vitest';
import fs from 'node:fs/promises';
import path from 'node:path';
import { scanAgentsDir, mergeConfigs } from '../src/scanner.js';
import { getTarget, targets } from '../src/targets/registry.js';
import { ensureGitignore } from '../src/gitignore.js';
import { loadRc } from '../src/rc.js';
import type { AgentsConfig } from '../src/types.js';

// ─── Outputs dir (gitignored) ───────────────────────────────

const OUTPUTS_DIR = path.join(import.meta.dirname, 'outputs');
const E2E_DIR = path.join(OUTPUTS_DIR, 'e2e');
const AGENTS_DIR = path.join(E2E_DIR, '.agents');

async function writeFile(rel: string, content: string) {
  const abs = path.join(E2E_DIR, rel);
  await fs.mkdir(path.dirname(abs), { recursive: true });
  await fs.writeFile(abs, content);
}

async function readFile(rel: string): Promise<string> {
  return fs.readFile(path.join(E2E_DIR, rel), 'utf-8');
}

async function fileExists(rel: string): Promise<boolean> {
  try { await fs.access(path.join(E2E_DIR, rel)); return true; } catch { return false; }
}

// ─── Test Data ──────────────────────────────────────────────

const AGENTS_MD = `# Test Project

## Structure

- \`src/\` — Source code
- \`.agents/\` — Agent config

## Conventions

- TypeScript everywhere
- Package manager: **pnpm**
`;

const SKILLS_MD = `# Skills

## test-skill

A skill for testing purposes.
`;

const SKILL_CONTENT = `---
name: test-skill
description: A skill for testing purposes
---

# Test Skill

Follow these instructions when testing:

1. Always write tests
2. Use vitest
3. Check coverage
`;

const WORKFLOW_CONTENT = `---
description: How to deploy
---

1. Run \`pnpm build\`
2. Run \`pnpm deploy\`
3. Verify deployment
`;

const MCP_JSON = {
  mcpServers: {
    context7: { type: 'http', url: 'https://mcp.context7.com/mcp' },
    'github-mcp': { type: 'stdio', command: 'npx', args: ['-y', '@modelcontextprotocol/server-github'] },
  },
};

const AGENTRC = {
  targets: ['cursor', 'claude'],
  scope: 'workspace',
  gitignore: true,
  mcp: true,
  rootFiles: ['AGENTS.md', 'SKILLS.md'],
};

// ─── Setup ──────────────────────────────────────────────────

beforeAll(async () => {
  await fs.rm(E2E_DIR, { recursive: true, force: true });
  await fs.mkdir(E2E_DIR, { recursive: true });

  await writeFile('.agents/AGENTS.md', AGENTS_MD);
  await writeFile('.agents/SKILLS.md', SKILLS_MD);
  await writeFile('.agents/mcp.json', JSON.stringify(MCP_JSON, null, 2));
  await writeFile('.agents/skills/test-skill/SKILL.md', SKILL_CONTENT);
  await writeFile('.agents/workflows/deploy.md', WORKFLOW_CONTENT);
  await writeFile('.agentrc', JSON.stringify(AGENTRC, null, 2));
});

// ─── Integration Tests ──────────────────────────────────────

describe('E2E: Scan .agents/', () => {
  let config: AgentsConfig;

  beforeAll(async () => {
    config = await scanAgentsDir(AGENTS_DIR);
  });

  it('reads AGENTS.md', () => {
    expect(config.agentsmd).toContain('# Test Project');
  });

  it('reads SKILLS.md', () => {
    expect(config.skillsmd).toContain('## test-skill');
  });

  it('parses skill with frontmatter', () => {
    expect(config.skills).toHaveLength(1);
    expect(config.skills[0].name).toBe('test-skill');
    expect(config.skills[0].description).toBe('A skill for testing purposes');
  });

  it('parses workflow', () => {
    expect(config.workflows).toHaveLength(1);
    expect(config.workflows[0].name).toBe('deploy');
  });

  it('parses MCP servers', () => {
    expect(Object.keys(config.mcpServers)).toHaveLength(2);
    expect(config.mcpServers['context7'].url).toBe('https://mcp.context7.com/mcp');
  });
});

describe('E2E: Load .agentrc', () => {
  it('loads config', async () => {
    const { rc, filePath } = await loadRc(E2E_DIR);
    expect(filePath).toBe(path.join(E2E_DIR, '.agentrc'));
    expect(rc.targets).toEqual(['cursor', 'claude']);
  });
});

describe('E2E: Generate Cursor files', () => {
  beforeAll(async () => {
    const config = await scanAgentsDir(AGENTS_DIR);
    const cursor = getTarget('cursor');
    const files = cursor.generate(config, 'workspace');

    for (const file of files) {
      const abs = path.join(E2E_DIR, file.relativePath);
      await fs.mkdir(path.dirname(abs), { recursive: true });
      await fs.writeFile(abs, file.content);
    }
    await ensureGitignore(E2E_DIR, cursor.gitignoreEntries);
  });

  it('creates .cursor/rules/_project-context.mdc', async () => {
    expect(await fileExists('.cursor/rules/_project-context.mdc')).toBe(true);
    const content = await readFile('.cursor/rules/_project-context.mdc');
    expect(content).toContain('alwaysApply: true');
    expect(content).toContain('# Test Project');
  });

  it('creates .cursor/rules/skills/test-skill.mdc', async () => {
    expect(await fileExists('.cursor/rules/skills/test-skill.mdc')).toBe(true);
  });

  it('creates .cursor/mcp.json', async () => {
    const raw = await readFile('.cursor/mcp.json');
    const parsed = JSON.parse(raw);
    expect(parsed.mcpServers.context7.url).toBe('https://mcp.context7.com/mcp');
    expect(parsed.mcpServers['github-mcp'].command).toBe('npx');
  });

  it('adds .cursor/ to .gitignore', async () => {
    const gitignore = await readFile('.gitignore');
    expect(gitignore).toContain('.cursor/');
  });
});

describe('E2E: Generate Claude files', () => {
  beforeAll(async () => {
    const config = await scanAgentsDir(AGENTS_DIR);
    const claude = getTarget('claude');
    const files = claude.generate(config, 'workspace');

    for (const file of files) {
      const abs = path.join(E2E_DIR, file.relativePath);
      await fs.mkdir(path.dirname(abs), { recursive: true });
      await fs.writeFile(abs, file.content);
    }
  });

  it('creates CLAUDE.md', async () => {
    const content = await readFile('CLAUDE.md');
    expect(content).toContain('# Test Project');
    expect(content).toContain('test-skill');
  });

  it('creates .mcp.json', async () => {
    const parsed = JSON.parse(await readFile('.mcp.json'));
    expect(parsed.mcpServers).toHaveProperty('context7');
  });
});

describe('E2E: Generate all targets to outputs/', () => {
  const expectedFiles: Record<string, string[]> = {
    cursor: ['.cursor/rules/_project-context.mdc', '.cursor/mcp.json'],
    copilot: ['.github/copilot-instructions.md', '.vscode/mcp.json'],
    windsurf: ['.windsurf/rules/agents.md', '.windsurf/mcp.json'],
    gemini: ['.gemini/agents.md', '.vscode/mcp.json'],
    claude: ['CLAUDE.md', '.mcp.json'],
  };

  for (const target of targets) {
    it(`${target.label} generates expected files`, async () => {
      const config = await scanAgentsDir(AGENTS_DIR);
      const files = target.generate(config, 'workspace');

      const generatedPaths = files.map((f) => f.relativePath);
      for (const expected of expectedFiles[target.name]) {
        expect(generatedPaths).toContain(expected);
      }

      // Write per-target for inspection
      const targetDir = path.join(OUTPUTS_DIR, target.name);
      for (const file of files) {
        const abs = path.join(targetDir, file.relativePath);
        await fs.mkdir(path.dirname(abs), { recursive: true });
        await fs.writeFile(abs, file.content);
      }
    });
  }
});

describe('E2E: Root files copy', () => {
  it('AGENTS.md matches source', async () => {
    const config = await scanAgentsDir(AGENTS_DIR);
    await writeFile('AGENTS.md', config.agentsmd!);
    expect(await readFile('AGENTS.md')).toBe(await readFile('.agents/AGENTS.md'));
  });

  it('SKILLS.md matches source', async () => {
    const config = await scanAgentsDir(AGENTS_DIR);
    await writeFile('SKILLS.md', config.skillsmd!);
    expect(await readFile('SKILLS.md')).toBe(await readFile('.agents/SKILLS.md'));
  });
});
