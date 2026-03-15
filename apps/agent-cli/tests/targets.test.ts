import { describe, it, expect } from 'vitest';
import { targets, getTarget, isTargetName, targetNames } from '../src/targets/registry.js';
import type { AgentsConfig } from '../src/types.js';

const mockConfig: AgentsConfig = {
  agentsmd: '# Test Project\n\nInstructions.',
  skillsmd: '# Skills\n\nIndex.',
  skills: [
    { name: 'test-skill', description: 'A test skill', content: '# Test\n\nDo things.', filePath: '/test' },
  ],
  workflows: [
    { name: 'deploy', description: 'Deploy things', content: '1. Build\n2. Deploy', filePath: '/wf' },
  ],
  mcpServers: {
    context7: { type: 'http', url: 'https://mcp.context7.com/mcp' },
  },
};

const emptyConfig: AgentsConfig = {
  agentsmd: null,
  skillsmd: null,
  skills: [],
  workflows: [],
  mcpServers: {},
};

describe('Target Registry', () => {
  it('has all 5 targets', () => {
    expect(targets).toHaveLength(5);
    expect(targetNames).toEqual(['cursor', 'copilot', 'windsurf', 'gemini', 'claude']);
  });

  it('isTargetName validates correctly', () => {
    expect(isTargetName('cursor')).toBe(true);
    expect(isTargetName('claude')).toBe(true);
    expect(isTargetName('vscode')).toBe(false);
    expect(isTargetName('')).toBe(false);
  });

  it('getTarget returns correct target', () => {
    const cursor = getTarget('cursor');
    expect(cursor.name).toBe('cursor');
    expect(cursor.label).toBe('Cursor');
  });

  it('getTarget throws for unknown target', () => {
    expect(() => getTarget('unknown' as any)).toThrow();
  });
});

describe('Cursor generate', () => {
  const cursor = getTarget('cursor');

  it('generates MDC files for skills', () => {
    const files = cursor.generate(mockConfig, 'workspace');
    const skillFile = files.find((f) => f.relativePath.includes('test-skill'));
    expect(skillFile).toBeDefined();
    expect(skillFile!.content).toContain('A test skill');
    expect(skillFile!.content).toContain('---');
  });

  it('generates MCP json when servers exist', () => {
    const files = cursor.generate(mockConfig, 'workspace');
    const mcpFile = files.find((f) => f.relativePath === '.cursor/mcp.json');
    expect(mcpFile).toBeDefined();
    expect(mcpFile!.content).toContain('context7');
    expect(mcpFile!.content).toContain('https://mcp.context7.com/mcp');
  });

  it('skips MCP json when no servers', () => {
    const files = cursor.generate(emptyConfig, 'workspace');
    const mcpFile = files.find((f) => f.relativePath === '.cursor/mcp.json');
    expect(mcpFile).toBeUndefined();
  });

  it('generates project context rule', () => {
    const files = cursor.generate(mockConfig, 'workspace');
    const contextFile = files.find((f) => f.relativePath.includes('_project-context'));
    expect(contextFile).toBeDefined();
    expect(contextFile!.content).toContain('alwaysApply: true');
  });
});

describe('Claude generate', () => {
  const claude = getTarget('claude');

  it('generates CLAUDE.md', () => {
    const files = claude.generate(mockConfig, 'workspace');
    const claudeFile = files.find((f) => f.relativePath === 'CLAUDE.md');
    expect(claudeFile).toBeDefined();
    expect(claudeFile!.content).toContain('Test Project');
  });

  it('generates .mcp.json when servers exist', () => {
    const files = claude.generate(mockConfig, 'workspace');
    const mcpFile = files.find((f) => f.relativePath === '.mcp.json');
    expect(mcpFile).toBeDefined();
    expect(mcpFile!.content).toContain('context7');
  });

  it('skips .mcp.json when no servers', () => {
    const files = claude.generate(emptyConfig, 'workspace');
    const mcpFile = files.find((f) => f.relativePath === '.mcp.json');
    expect(mcpFile).toBeUndefined();
  });

  it('has .mcp.json in gitignoreEntries', () => {
    expect(claude.gitignoreEntries).toContain('.mcp.json');
  });
});

describe('Copilot generate', () => {
  const copilot = getTarget('copilot');

  it('generates copilot-instructions.md', () => {
    const files = copilot.generate(mockConfig, 'workspace');
    const instrFile = files.find((f) => f.relativePath.includes('copilot-instructions'));
    expect(instrFile).toBeDefined();
  });

  it('generates .vscode/mcp.json for MCP', () => {
    const files = copilot.generate(mockConfig, 'workspace');
    const mcpFile = files.find((f) => f.relativePath === '.vscode/mcp.json');
    expect(mcpFile).toBeDefined();
  });
});

describe('Windsurf generate', () => {
  const windsurf = getTarget('windsurf');

  it('generates rules/agents.md', () => {
    const files = windsurf.generate(mockConfig, 'workspace');
    const rulesFile = files.find((f) => f.relativePath.includes('agents.md'));
    expect(rulesFile).toBeDefined();
  });

  it('generates .windsurf/mcp.json for MCP', () => {
    const files = windsurf.generate(mockConfig, 'workspace');
    const mcpFile = files.find((f) => f.relativePath === '.windsurf/mcp.json');
    expect(mcpFile).toBeDefined();
  });
});

describe('Gemini generate', () => {
  const gemini = getTarget('gemini');

  it('generates .gemini/agents.md', () => {
    const files = gemini.generate(mockConfig, 'workspace');
    const agentsFile = files.find((f) => f.relativePath === '.gemini/agents.md');
    expect(agentsFile).toBeDefined();
  });

  it('generates .vscode/mcp.json for MCP', () => {
    const files = gemini.generate(mockConfig, 'workspace');
    const mcpFile = files.find((f) => f.relativePath === '.vscode/mcp.json');
    expect(mcpFile).toBeDefined();
  });
});

describe('All targets include skills and workflows in output', () => {
  for (const target of targets) {
    it(`${target.label} includes skill content`, () => {
      const files = target.generate(mockConfig, 'workspace');
      const allContent = files.map((f) => f.content).join('\n');
      expect(allContent).toContain('test-skill');
    });
  }
});
