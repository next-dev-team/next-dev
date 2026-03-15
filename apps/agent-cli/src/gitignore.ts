import fs from 'node:fs/promises';
import path from 'node:path';

const MARKER_START = '# >>> agent-cli (auto-generated, do not edit)';
const MARKER_END = '# <<< agent-cli';

/**
 * Ensure the target IDE's config directory is in .gitignore.
 * Uses markers to manage a managed block that can be updated on re-sync.
 *
 * @returns true if .gitignore was modified, false if already up-to-date
 */
export async function ensureGitignore(
  rootDir: string,
  entries: string[]
): Promise<{ modified: boolean; path: string }> {
  const gitignorePath = path.join(rootDir, '.gitignore');

  let content = '';
  try {
    content = await fs.readFile(gitignorePath, 'utf-8');
  } catch {
    // No .gitignore yet — we'll create one
  }

  // Build the managed block
  const managedBlock = [
    MARKER_START,
    ...entries,
    MARKER_END,
  ].join('\n');

  // Check if managed block already exists
  const markerStartIdx = content.indexOf(MARKER_START);
  const markerEndIdx = content.indexOf(MARKER_END);

  if (markerStartIdx !== -1 && markerEndIdx !== -1) {
    // Replace existing block
    const before = content.slice(0, markerStartIdx);
    const after = content.slice(markerEndIdx + MARKER_END.length);
    const newContent = before + managedBlock + after;

    if (newContent === content) {
      return { modified: false, path: gitignorePath };
    }

    await fs.writeFile(gitignorePath, newContent);
    return { modified: true, path: gitignorePath };
  }

  // Append new block
  const separator = content.endsWith('\n') ? '\n' : '\n\n';
  const newContent = content + separator + managedBlock + '\n';
  await fs.writeFile(gitignorePath, newContent);
  return { modified: true, path: gitignorePath };
}
