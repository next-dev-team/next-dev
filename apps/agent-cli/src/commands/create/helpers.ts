import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { pathExists } from '../../utils/files.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const TEMPLATES_DIR = path.join(__dirname, '..', '..', '..', 'templates');

/**
 * Recursively copy a directory, replacing {{PROJECT_NAME}} in file contents.
 * Skips .DS_Store files.
 */
export async function copyTemplate(srcDir: string, destDir: string, projectName: string) {
  const entries = await fs.readdir(srcDir, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.name === '.DS_Store') continue;

    const srcPath = path.join(srcDir, entry.name);
    const destPath = path.join(destDir, entry.name);

    if (entry.isDirectory()) {
      await fs.mkdir(destPath, { recursive: true });
      await copyTemplate(srcPath, destPath, projectName);
    } else {
      let content = await fs.readFile(srcPath, 'utf-8');
      content = content.replace(/\{\{PROJECT_NAME\}\}/g, projectName);
      await fs.writeFile(destPath, content);
    }
  }
}

/**
 * Resolve a single template file — check template-specific first, fallback to base.
 */
export async function resolveTemplateFile(templateName: string, relativePath: string): Promise<string | null> {
  const specificPath = path.join(TEMPLATES_DIR, templateName, relativePath);
  try { return await fs.readFile(specificPath, 'utf-8'); } catch {}

  const basePath = path.join(TEMPLATES_DIR, relativePath);
  try { return await fs.readFile(basePath, 'utf-8'); } catch {}

  return null;
}

/**
 * Ensure .agents/ config exists in the project directory.
 * Fills in missing files from templates, skips existing ones.
 */
export async function ensureAgentConfig(
  projectDir: string,
  templateName: string,
  projectName: string,
): Promise<string[]> {
  const agentFiles = [
    { rel: '.agents/AGENTS.md', templatePath: '.agents/AGENTS.md' },
    { rel: '.agents/SKILLS.md', templatePath: '.agents/SKILLS.md' },
    { rel: '.agents/mcp.json', templatePath: '.agents/mcp.json' },
    { rel: '.agentrc', templatePath: '.agentrc' },
  ];

  const added: string[] = [];

  for (const file of agentFiles) {
    const absPath = path.join(projectDir, file.rel);
    if (await pathExists(absPath)) continue;

    const content = await resolveTemplateFile(templateName, file.templatePath);
    if (content) {
      await fs.mkdir(path.dirname(absPath), { recursive: true });
      await fs.writeFile(absPath, content.replace(/\{\{PROJECT_NAME\}\}/g, projectName));
      added.push(file.rel);
    }
  }

  // Ensure dirs
  for (const dir of ['.agents/skills', '.agents/workflows']) {
    const absDir = path.join(projectDir, dir);
    if (!(await pathExists(absDir))) {
      await fs.mkdir(absDir, { recursive: true });
    }
  }

  return added;
}
