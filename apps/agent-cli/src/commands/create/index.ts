import { defineCommand } from 'citty';
import { execSync } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
import chalk from 'chalk';
import { pathExists } from '../../utils/files.js';
import { TEMPLATES, templateNames } from './templates.js';
import { TEMPLATES_DIR, copyTemplate, ensureAgentConfig } from './helpers.js';

export default defineCommand({
  meta: {
    name: 'create',
    description: 'Create a new project with agent config built in',
  },
  args: {
    name: {
      type: 'positional',
      required: false,
      description: 'Project name / directory',
    },
    template: {
      type: 'string',
      alias: 't',
      default: 'vite',
      description: `Template: ${templateNames.join(' | ')} (default: vite)`,
    },
    provider: {
      type: 'string',
      alias: 'p',
      description: 'Custom scaffold CLI (e.g. "npx -y create-vite@latest {{DIR}} --template react-ts")',
    },
    list: {
      type: 'boolean',
      alias: 'l',
      default: false,
      description: 'List available templates',
    },
  },
  async run({ args }) {
    // List templates
    if (args.list) {
      console.log(chalk.bold('\n📋 Available templates\n'));
      for (const [key, tpl] of Object.entries(TEMPLATES)) {
        console.log(`  ${chalk.green(key.padEnd(12))} ${tpl.label}`);
        console.log(chalk.dim(`  ${''.padEnd(12)} ${tpl.description}\n`));
      }
      console.log(chalk.dim('  Custom scaffold:'));
      console.log(chalk.dim('    agent-cli create my-app -p "npx -y create-vite@latest {{DIR}} --template vue-ts"\n'));
      return;
    }

    const projectName = args.name ? String(args.name) : '';
    const templateKey = String(args.template);

    if (!projectName) {
      console.error(chalk.red('\n  ✗ Project name required: agent-cli create <name>\n'));
      console.log(chalk.dim('  Examples:'));
      console.log(chalk.dim('    agent-cli create my-app'));
      console.log(chalk.dim('    agent-cli create my-app -p "npx -y create-next-app@latest {{DIR}} --ts"'));
      console.log(chalk.dim('    agent-cli create --list\n'));
      process.exit(1);
    }

    const cwd = process.cwd();
    const projectDir = path.join(cwd, projectName);

    if (await pathExists(projectDir)) {
      console.error(chalk.red(`\n  ✗ Directory "${projectName}" already exists.\n`));
      process.exit(1);
    }

    const useCustomProvider = Boolean(args.provider);
    const template = TEMPLATES[templateKey];

    if (!useCustomProvider && !template) {
      console.error(chalk.red(`\n  ✗ Unknown template: "${templateKey}". Available: ${templateNames.join(', ')}\n`));
      console.log(chalk.dim('  Or use -p for custom: agent-cli create my-app -p "your-cli {{DIR}}"\n'));
      process.exit(1);
    }

    console.log(chalk.bold('\n🚀 agent-cli create\n'));
    console.log(chalk.dim(`  Project:  ${projectName}`));
    if (useCustomProvider) {
      console.log(chalk.dim(`  Provider: ${args.provider}`));
    } else {
      console.log(chalk.dim(`  Template: ${template!.label}`));
    }
    console.log(chalk.dim(`  Path:     ${projectDir}\n`));

    // ── Step 1: Scaffold ────────────────────────────

    if (useCustomProvider) {
      const customCmd = String(args.provider);
      const scaffoldCmd = customCmd.includes('{{DIR}}')
        ? customCmd.replace('{{DIR}}', projectName)
        : `${customCmd} ${projectName}`;

      console.log(chalk.blue('  ▸ Running scaffold CLI...'));
      try {
        execSync(scaffoldCmd, { cwd, stdio: 'pipe' });
        console.log(chalk.green('  ✓ Scaffold complete\n'));
      } catch (err: any) {
        console.error(chalk.red(`  ✗ Scaffold failed: ${err.stderr?.toString() || err.message}\n`));
        process.exit(1);
      }
    } else if (template?.scaffold) {
      console.log(chalk.blue('  ▸ Running scaffold CLI...'));
      const scaffoldCmd = template.scaffold.replace('{{DIR}}', projectName);
      try {
        execSync(scaffoldCmd, { cwd, stdio: 'pipe' });
        console.log(chalk.green('  ✓ Scaffold complete\n'));
      } catch (err: any) {
        console.error(chalk.red(`  ✗ Scaffold failed: ${err.stderr?.toString() || err.message}\n`));
        process.exit(1);
      }
    } else {
      console.log(chalk.blue('  ▸ Copying pre-template...'));
      const templateDir = path.join(TEMPLATES_DIR, template!.templateDir);

      if (!(await pathExists(templateDir))) {
        console.error(chalk.red(`  ✗ Template directory not found: ${templateDir}\n`));
        process.exit(1);
      }

      await fs.mkdir(projectDir, { recursive: true });
      await copyTemplate(templateDir, projectDir, projectName);
      console.log(chalk.green('  ✓ Template copied\n'));
    }

    // ── Step 2: Ensure agent config ─────────────────

    const tplDir = useCustomProvider ? templateKey : (template?.templateDir ?? templateKey);
    const added = await ensureAgentConfig(projectDir, tplDir, projectName);
    for (const rel of added) {
      console.log(chalk.green(`    ✚ ${rel}`));
    }

    if (added.length > 0) console.log();

    console.log(chalk.bold(`  ✓ Created ${projectName}\n`));
    console.log(chalk.dim('  Next steps:'));
    console.log(chalk.dim(`    cd ${projectName}`));
    console.log(chalk.dim('    npm install'));
    console.log(chalk.dim('    npm run dev'));
    console.log(chalk.dim('    agent-cli sync'));
    console.log();
  },
});
