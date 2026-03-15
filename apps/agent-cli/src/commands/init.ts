import { defineCommand } from 'citty';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import chalk from 'chalk';
import { pathExists } from '../utils/files.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** Resolve templates dir — works from both src/ and dist/ */
function resolveTemplatesDir(): string {
  // From src/commands/ → ../../templates
  // From dist/ → ../templates
  const fromSrc = path.join(__dirname, '..', '..', 'templates');
  const fromDist = path.join(__dirname, '..', 'templates');

  // Try src path first (dev), fallback to dist path
  return fromSrc;
}

async function readTemplate(name: string): Promise<string> {
  const templatesDir = resolveTemplatesDir();
  const filePath = path.join(templatesDir, name);
  try {
    return await fs.readFile(filePath, 'utf-8');
  } catch {
    throw new Error(`Template not found: ${filePath}`);
  }
}

export default defineCommand({
  meta: {
    name: 'init',
    description: 'Initialize .agents/ directory and .agentrc config',
  },
  args: {
    name: {
      type: 'string',
      description: 'Project name (default: directory name)',
    },
    force: {
      type: 'boolean',
      default: false,
      description: 'Overwrite existing files',
    },
  },
  async run({ args }) {
    const cwd = process.cwd();
    const force = Boolean(args.force);
    const projectName = args.name ? String(args.name) : path.basename(cwd);

    console.log(chalk.bold('\n🚀 agent-cli init\n'));

    // Load templates
    const agentsMd = (await readTemplate('.agents/AGENTS.md')).replace(/\{\{PROJECT_NAME\}\}/g, projectName);
    const skillsMd = await readTemplate('.agents/SKILLS.md');
    const mcpJson = await readTemplate('.agents/mcp.json');
    const agentrc = await readTemplate('.agentrc');

    const files: { rel: string; content: string }[] = [
      { rel: '.agentrc', content: agentrc },
      { rel: '.agents/AGENTS.md', content: agentsMd },
      { rel: '.agents/SKILLS.md', content: skillsMd },
      { rel: '.agents/mcp.json', content: mcpJson },
    ];

    let created = 0;
    let skipped = 0;

    for (const file of files) {
      const absPath = path.join(cwd, file.rel);
      const exists = await pathExists(absPath);

      if (exists && !force) {
        console.log(chalk.dim(`  ─ ${file.rel} (exists)`));
        skipped++;
        continue;
      }

      await fs.mkdir(path.dirname(absPath), { recursive: true });
      await fs.writeFile(absPath, file.content);
      console.log(chalk.green(`  ✚ ${file.rel}`));
      created++;
    }

    // Create skills/ and workflows/ directories
    const dirs = ['.agents/skills', '.agents/workflows'];
    for (const dir of dirs) {
      const absDir = path.join(cwd, dir);
      if (!(await pathExists(absDir))) {
        await fs.mkdir(absDir, { recursive: true });
        console.log(chalk.green(`  ✚ ${dir}/`));
      } else {
        console.log(chalk.dim(`  ─ ${dir}/ (exists)`));
      }
    }

    console.log(chalk.bold(`\n  ${created} created, ${skipped} skipped\n`));

    console.log(chalk.dim('  Next steps:'));
    console.log(chalk.dim('  1. Edit .agents/AGENTS.md with your project instructions'));
    console.log(chalk.dim('  2. Edit .agentrc to set your target IDEs'));
    console.log(chalk.dim('  3. Run `agent-cli sync` to generate IDE configs'));
    console.log(chalk.dim('  4. Run `agent-cli mcp add <name> --url <url>` to add MCP servers\n'));
  },
});
