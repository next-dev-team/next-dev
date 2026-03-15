import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { loadRc } from '../src/rc.js';

let tmpDir: string;

beforeEach(async () => {
  tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'agent-cli-rc-'));
});

afterEach(async () => {
  await fs.rm(tmpDir, { recursive: true, force: true });
});

describe('loadRc', () => {
  it('returns defaults when no .agentrc exists', async () => {
    const { rc, filePath } = await loadRc(tmpDir);
    expect(filePath).toBeNull();
    expect(rc.targets).toEqual([]);
    expect(rc.scope).toBe('workspace');
    expect(rc.gitignore).toBe(true);
    expect(rc.mcp).toBe(true);
    expect(rc.rootFiles).toEqual(['AGENTS.md', 'SKILLS.md']);
  });

  it('reads .agentrc file', async () => {
    await fs.writeFile(
      path.join(tmpDir, '.agentrc'),
      JSON.stringify({
        targets: ['cursor', 'claude'],
        scope: 'global',
        mcp: false,
      })
    );

    const { rc, filePath } = await loadRc(tmpDir);
    expect(filePath).toBe(path.join(tmpDir, '.agentrc'));
    expect(rc.targets).toEqual(['cursor', 'claude']);
    expect(rc.scope).toBe('global');
    expect(rc.mcp).toBe(false);
    // Defaults for unspecified fields
    expect(rc.gitignore).toBe(true);
    expect(rc.rootFiles).toEqual(['AGENTS.md', 'SKILLS.md']);
  });

  it('reads .agentrc.json as fallback', async () => {
    await fs.writeFile(
      path.join(tmpDir, '.agentrc.json'),
      JSON.stringify({ targets: ['windsurf'] })
    );

    const { rc, filePath } = await loadRc(tmpDir);
    expect(filePath).toBe(path.join(tmpDir, '.agentrc.json'));
    expect(rc.targets).toEqual(['windsurf']);
  });

  it('prefers .agentrc over .agentrc.json', async () => {
    await fs.writeFile(path.join(tmpDir, '.agentrc'), JSON.stringify({ targets: ['cursor'] }));
    await fs.writeFile(path.join(tmpDir, '.agentrc.json'), JSON.stringify({ targets: ['claude'] }));

    const { rc } = await loadRc(tmpDir);
    expect(rc.targets).toEqual(['cursor']);
  });

  it('handles invalid JSON gracefully', async () => {
    await fs.writeFile(path.join(tmpDir, '.agentrc'), 'not json!!!');

    const { rc, filePath } = await loadRc(tmpDir);
    expect(filePath).toBeNull(); // Falls through
    expect(rc.targets).toEqual([]); // Defaults
  });

  it('merges partial config with defaults', async () => {
    await fs.writeFile(
      path.join(tmpDir, '.agentrc'),
      JSON.stringify({ rootFiles: ['AGENTS.md'] })
    );

    const { rc } = await loadRc(tmpDir);
    expect(rc.rootFiles).toEqual(['AGENTS.md']);
    expect(rc.scope).toBe('workspace'); // default
    expect(rc.gitignore).toBe(true); // default
  });
});
