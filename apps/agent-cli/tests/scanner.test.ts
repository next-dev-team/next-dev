import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { scanAgentsDir, mergeConfigs } from '../src/scanner.js';

let tmpDir: string;

beforeEach(async () => {
  tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'agent-cli-test-'));
});

afterEach(async () => {
  await fs.rm(tmpDir, { recursive: true, force: true });
});

describe('scanAgentsDir', () => {
  it('returns empty config for missing directory', async () => {
    const config = await scanAgentsDir(path.join(tmpDir, 'nonexistent'));
    expect(config.agentsmd).toBeNull();
    expect(config.skillsmd).toBeNull();
    expect(config.skills).toEqual([]);
    expect(config.workflows).toEqual([]);
    expect(config.mcpServers).toEqual({});
  });

  it('reads AGENTS.md', async () => {
    const agentsDir = path.join(tmpDir, '.agents');
    await fs.mkdir(agentsDir, { recursive: true });
    await fs.writeFile(path.join(agentsDir, 'AGENTS.md'), '# My Project\n\nInstructions here.');

    const config = await scanAgentsDir(agentsDir);
    expect(config.agentsmd).toBe('# My Project\n\nInstructions here.');
  });

  it('reads SKILLS.md', async () => {
    const agentsDir = path.join(tmpDir, '.agents');
    await fs.mkdir(agentsDir, { recursive: true });
    await fs.writeFile(path.join(agentsDir, 'SKILLS.md'), '# Skills\n\nList here.');

    const config = await scanAgentsDir(agentsDir);
    expect(config.skillsmd).toBe('# Skills\n\nList here.');
  });

  it('parses skills with frontmatter', async () => {
    const skillDir = path.join(tmpDir, '.agents', 'skills', 'my-skill');
    await fs.mkdir(skillDir, { recursive: true });
    await fs.writeFile(
      path.join(skillDir, 'SKILL.md'),
      '---\nname: my-skill\ndescription: Does things\n---\n\n# My Skill\n\nContent here.\n'
    );

    const config = await scanAgentsDir(path.join(tmpDir, '.agents'));
    expect(config.skills).toHaveLength(1);
    expect(config.skills[0].name).toBe('my-skill');
    expect(config.skills[0].description).toBe('Does things');
    expect(config.skills[0].content).toBe('# My Skill\n\nContent here.');
  });

  it('uses folder name if skill has no frontmatter name', async () => {
    const skillDir = path.join(tmpDir, '.agents', 'skills', 'auto-named');
    await fs.mkdir(skillDir, { recursive: true });
    await fs.writeFile(path.join(skillDir, 'SKILL.md'), '---\ndescription: test\n---\n\nContent.');

    const config = await scanAgentsDir(path.join(tmpDir, '.agents'));
    expect(config.skills[0].name).toBe('auto-named');
  });

  it('parses workflows', async () => {
    const wfDir = path.join(tmpDir, '.agents', 'workflows');
    await fs.mkdir(wfDir, { recursive: true });
    await fs.writeFile(
      path.join(wfDir, 'deploy.md'),
      '---\ndescription: How to deploy\n---\n\n1. Run build\n2. Run deploy\n'
    );

    const config = await scanAgentsDir(path.join(tmpDir, '.agents'));
    expect(config.workflows).toHaveLength(1);
    expect(config.workflows[0].name).toBe('deploy');
    expect(config.workflows[0].description).toBe('How to deploy');
    expect(config.workflows[0].content).toBe('1. Run build\n2. Run deploy');
  });

  it('reads mcp.json', async () => {
    const agentsDir = path.join(tmpDir, '.agents');
    await fs.mkdir(agentsDir, { recursive: true });
    await fs.writeFile(
      path.join(agentsDir, 'mcp.json'),
      JSON.stringify({
        mcpServers: {
          context7: { type: 'http', url: 'https://mcp.context7.com/mcp' },
        },
      })
    );

    const config = await scanAgentsDir(agentsDir);
    expect(config.mcpServers).toHaveProperty('context7');
    expect(config.mcpServers.context7.type).toBe('http');
    expect(config.mcpServers.context7.url).toBe('https://mcp.context7.com/mcp');
  });

  it('handles invalid mcp.json gracefully', async () => {
    const agentsDir = path.join(tmpDir, '.agents');
    await fs.mkdir(agentsDir, { recursive: true });
    await fs.writeFile(path.join(agentsDir, 'mcp.json'), 'not valid json{{{');

    const config = await scanAgentsDir(agentsDir);
    expect(config.mcpServers).toEqual({});
  });

  it('scans multiple skills and workflows', async () => {
    const agentsDir = path.join(tmpDir, '.agents');
    await fs.mkdir(path.join(agentsDir, 'skills', 'a'), { recursive: true });
    await fs.mkdir(path.join(agentsDir, 'skills', 'b'), { recursive: true });
    await fs.mkdir(path.join(agentsDir, 'workflows'), { recursive: true });

    await fs.writeFile(path.join(agentsDir, 'skills', 'a', 'SKILL.md'), '---\ndescription: Skill A\n---\nA');
    await fs.writeFile(path.join(agentsDir, 'skills', 'b', 'SKILL.md'), '---\ndescription: Skill B\n---\nB');
    await fs.writeFile(path.join(agentsDir, 'workflows', 'test.md'), '---\ndescription: Test WF\n---\nDo stuff');

    const config = await scanAgentsDir(agentsDir);
    expect(config.skills).toHaveLength(2);
    expect(config.workflows).toHaveLength(1);
  });
});

describe('mergeConfigs', () => {
  it('merges two configs', () => {
    const global = {
      agentsmd: 'Global instructions',
      skillsmd: 'Global skills',
      skills: [{ name: 'shared', description: 'global', content: 'global content', filePath: '/g' }],
      workflows: [],
      mcpServers: { server1: { type: 'http', url: 'https://a.com' } },
    };

    const workspace = {
      agentsmd: 'Workspace instructions',
      skillsmd: null,
      skills: [{ name: 'local', description: 'local', content: 'local content', filePath: '/l' }],
      workflows: [],
      mcpServers: { server2: { type: 'stdio', command: 'npx test' } },
    };

    const merged = mergeConfigs(global, workspace);
    expect(merged.agentsmd).toBe('Workspace instructions'); // workspace overrides
    expect(merged.skillsmd).toBe('Global skills'); // global fallback
    expect(merged.skills).toHaveLength(2); // both
    expect(merged.mcpServers).toHaveProperty('server1');
    expect(merged.mcpServers).toHaveProperty('server2');
  });

  it('workspace skills override global with same name', () => {
    const global = {
      agentsmd: null, skillsmd: null, workflows: [], mcpServers: {},
      skills: [{ name: 'shared', description: 'global', content: 'old', filePath: '/g' }],
    };
    const workspace = {
      agentsmd: null, skillsmd: null, workflows: [], mcpServers: {},
      skills: [{ name: 'shared', description: 'workspace', content: 'new', filePath: '/w' }],
    };

    const merged = mergeConfigs(global, workspace);
    expect(merged.skills).toHaveLength(1);
    expect(merged.skills[0].description).toBe('workspace');
    expect(merged.skills[0].content).toBe('new');
  });

  it('workspace MCP servers override global with same name', () => {
    const global = {
      agentsmd: null, skillsmd: null, skills: [], workflows: [],
      mcpServers: { ctx: { type: 'http', url: 'https://old.com' } },
    };
    const workspace = {
      agentsmd: null, skillsmd: null, skills: [], workflows: [],
      mcpServers: { ctx: { type: 'http', url: 'https://new.com' } },
    };

    const merged = mergeConfigs(global, workspace);
    expect(Object.keys(merged.mcpServers)).toHaveLength(1);
    expect(merged.mcpServers.ctx.url).toBe('https://new.com');
  });

  it('handles empty configs', () => {
    const empty = { agentsmd: null, skillsmd: null, skills: [], workflows: [], mcpServers: {} };
    const merged = mergeConfigs(empty, empty);
    expect(merged.skills).toEqual([]);
    expect(merged.workflows).toEqual([]);
    expect(merged.mcpServers).toEqual({});
  });
});
