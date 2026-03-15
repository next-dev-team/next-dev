import fs from 'node:fs/promises';
import path from 'node:path';
import type { AgentRc } from './types.js';

const RC_FILES = ['.agentrc', '.agentrc.json'];

const DEFAULTS: Required<AgentRc> = {
  targets: [],
  scope: 'workspace',
  gitignore: true,
  mcp: true,
  rootFiles: ['AGENTS.md', 'SKILLS.md'],
};

/**
 * Load .agentrc from the project root.
 * Searches for .agentrc or .agentrc.json.
 * Returns defaults if no config found.
 */
export async function loadRc(cwd: string): Promise<{ rc: Required<AgentRc>; filePath: string | null }> {
  for (const name of RC_FILES) {
    const filePath = path.join(cwd, name);
    try {
      const raw = await fs.readFile(filePath, 'utf-8');
      const parsed = JSON.parse(raw) as AgentRc;
      return {
        rc: { ...DEFAULTS, ...parsed },
        filePath,
      };
    } catch {
      continue;
    }
  }

  return { rc: { ...DEFAULTS }, filePath: null };
}
