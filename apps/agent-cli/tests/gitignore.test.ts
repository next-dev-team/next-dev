import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { ensureGitignore } from '../src/gitignore.js';

let tmpDir: string;

beforeEach(async () => {
  tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'agent-cli-gi-'));
});

afterEach(async () => {
  await fs.rm(tmpDir, { recursive: true, force: true });
});

describe('ensureGitignore', () => {
  it('creates .gitignore if none exists', async () => {
    const result = await ensureGitignore(tmpDir, ['.cursor/', 'CLAUDE.md']);
    expect(result.modified).toBe(true);

    const content = await fs.readFile(path.join(tmpDir, '.gitignore'), 'utf-8');
    expect(content).toContain('>>> agent-cli');
    expect(content).toContain('.cursor/');
    expect(content).toContain('CLAUDE.md');
    expect(content).toContain('<<< agent-cli');
  });

  it('appends to existing .gitignore', async () => {
    await fs.writeFile(path.join(tmpDir, '.gitignore'), 'node_modules/\n.env\n');

    const result = await ensureGitignore(tmpDir, ['.cursor/']);
    expect(result.modified).toBe(true);

    const content = await fs.readFile(path.join(tmpDir, '.gitignore'), 'utf-8');
    expect(content).toContain('node_modules/');
    expect(content).toContain('.env');
    expect(content).toContain('.cursor/');
  });

  it('replaces existing managed block', async () => {
    // First write
    await ensureGitignore(tmpDir, ['.cursor/']);
    // Update
    const result = await ensureGitignore(tmpDir, ['.cursor/', '.windsurf/']);
    expect(result.modified).toBe(true);

    const content = await fs.readFile(path.join(tmpDir, '.gitignore'), 'utf-8');
    expect(content).toContain('.windsurf/');

    // Should only have one managed block
    const markerCount = (content.match(/>>> agent-cli/g) || []).length;
    expect(markerCount).toBe(1);
  });

  it('returns modified: false if content unchanged', async () => {
    await ensureGitignore(tmpDir, ['.cursor/']);
    const result = await ensureGitignore(tmpDir, ['.cursor/']);
    expect(result.modified).toBe(false);
  });

  it('preserves content outside markers', async () => {
    const existing = '# custom\nnode_modules/\n.env\n';
    await fs.writeFile(path.join(tmpDir, '.gitignore'), existing);

    await ensureGitignore(tmpDir, ['.cursor/']);

    const content = await fs.readFile(path.join(tmpDir, '.gitignore'), 'utf-8');
    expect(content).toContain('node_modules/');
    expect(content).toContain('.env');
    expect(content).toContain('# custom');
  });
});
