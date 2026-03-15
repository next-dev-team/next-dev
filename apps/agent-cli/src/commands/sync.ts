import { defineCommand } from 'citty';
import os from 'node:os';
import path from 'node:path';
import fs from 'node:fs/promises';
import chalk from 'chalk';
import { scanAgentsDir, mergeConfigs } from '../scanner.js';
import { getTarget, isTargetName, targetNames, detectInstalledTools } from '../targets/registry.js';
import { ensureGitignore } from '../gitignore.js';
import { loadRc } from '../rc.js';
import type { Scope } from '../types.js';

export default defineCommand({
  meta: {
    name: 'sync',
    description: 'Sync .agents/ config to IDE targets',
  },
  args: {
    target: {
      type: 'string',
      description: `Target: ${targetNames.join(' | ')} | all (default: from .agentrc or all)`,
    },
    scope: {
      type: 'string',
      description: 'Scope: global | workspace (default: from .agentrc or per-target)',
    },
    dryRun: {
      type: 'boolean',
      default: false,
      description: 'Preview changes without writing',
    },
  },
  async run({ args }) {
    const cwd = process.cwd();
    const home = os.homedir();
    const dryRun = Boolean(args.dryRun);

    // Load .agentrc
    const { rc, filePath: rcPath } = await loadRc(cwd);

    // CLI args override .agentrc
    const targetArg = args.target ? String(args.target) : (rc.targets.length > 0 ? '_rc' : 'all');
    const scopeArg = args.scope ? String(args.scope) as Scope : undefined;

    console.log(chalk.bold('\n🔄 agent-cli sync\n'));
    if (rcPath) console.log(chalk.dim(`  Config:    ${path.basename(rcPath)}`));

    // 1. Load config from both global and workspace .agents/
    const globalConfig = await scanAgentsDir(path.join(home, '.agents'));
    const workspaceConfig = await scanAgentsDir(path.join(cwd, '.agents'));
    const config = mergeConfigs(globalConfig, workspaceConfig);

    const globalCount = globalConfig.skills.length + globalConfig.workflows.length;
    const wsCount = workspaceConfig.skills.length + workspaceConfig.workflows.length;
    const mcpCount = Object.keys(config.mcpServers).length;

    if (globalCount > 0) console.log(chalk.dim(`  Global:    ${globalConfig.skills.length} skill(s), ${globalConfig.workflows.length} workflow(s)`));
    if (wsCount > 0) console.log(chalk.dim(`  Workspace: ${workspaceConfig.skills.length} skill(s), ${workspaceConfig.workflows.length} workflow(s)`));
    if (mcpCount > 0) console.log(chalk.dim(`  MCP:       ${mcpCount} server(s)`));

    if (config.skills.length === 0 && config.workflows.length === 0) {
      console.log(chalk.yellow('\n  ⚠ No skills or workflows found.'));
      console.log(chalk.dim('    Local:  .agents/skills/<name>/SKILL.md'));
      console.log(chalk.dim('    Global: ~/.agents/skills/<name>/SKILL.md\n'));
      return;
    }

    console.log(chalk.dim(`  Merged:    ${config.skills.length} skill(s), ${config.workflows.length} workflow(s)\n`));

    // 2. Copy root files (AGENTS.md, SKILLS.md) based on .agentrc
    const rootFileNames = rc.rootFiles;
    const rootFileMap: Record<string, string | null> = {
      'AGENTS.md': config.agentsmd,
      'SKILLS.md': config.skillsmd,
    };

    const rootGitignoreEntries: string[] = [];

    for (const name of rootFileNames) {
      const content = rootFileMap[name];
      if (!content) continue;
      const absPath = path.join(cwd, name);
      let existing: string | null = null;
      try { existing = await fs.readFile(absPath, 'utf-8'); } catch {}

      rootGitignoreEntries.push(name);

      if (existing === content) {
        console.log(chalk.dim(`  ─ ${name}`));
      } else {
        const isNew = existing === null;
        if (dryRun) {
          console.log((isNew ? chalk.green : chalk.yellow)(`  ${isNew ? '✚' : '✎'} ${name} (would ${isNew ? 'create' : 'update'}) ← .agents/${name}`));
        } else {
          await fs.writeFile(absPath, content);
          console.log((isNew ? chalk.green : chalk.yellow)(`  ${isNew ? '✚' : '✎'} ${name}`) + chalk.dim(` ← .agents/${name}`));
        }
      }
    }

    // Gitignore root-level files
    if (rc.gitignore && rootGitignoreEntries.length > 0 && !dryRun) {
      await ensureGitignore(cwd, rootGitignoreEntries);
    }
    console.log();

    // 3. Resolve targets
    let targetList: string[];

    if (targetArg === '_rc') {
      // From .agentrc targets list
      targetList = rc.targets;
      console.log(chalk.dim(`  Targets from .agentrc: ${targetList.join(', ')}\n`));
    } else if (targetArg === 'all') {
      const detected = await detectInstalledTools(home, cwd);
      targetList = detected.filter((t) => t.detected).map((t) => t.name);

      if (targetList.length === 0) {
        console.log(chalk.yellow('  No AI tools detected.\n'));
        for (const t of detected) {
          console.log(chalk.dim(`    ✗ ${t.label} — ${t.reason}`));
        }
        console.log();
        return;
      }

      console.log(`  Detected ${chalk.green(targetList.length)} tool(s):`);
      for (const t of detected) {
        const icon = t.detected ? chalk.green('✓') : chalk.dim('✗');
        const text = t.detected ? chalk.white(t.label) : chalk.dim(t.label);
        console.log(`    ${icon} ${text} ${chalk.dim('— ' + t.reason)}`);
      }
      console.log();
    } else {
      if (!isTargetName(targetArg)) {
        console.error(chalk.red(`  ✗ Unknown target: "${targetArg}". Available: ${targetNames.join(', ')}, all\n`));
        process.exit(1);
      }
      targetList = [targetArg];
    }

    // 4. Sync each target
    for (const targetName of targetList) {
      const target = getTarget(targetName as any);
      const scope: Scope = scopeArg ?? (rc.scope as Scope) ?? target.defaultScope;

      // Strip MCP files if rc.mcp is false
      const targetConfig = rc.mcp ? config : { ...config, mcpServers: {} };

      console.log(chalk.bold(`  ▸ ${target.label}`) + chalk.dim(` (${scope})`));

      // Gitignore
      if (rc.gitignore && scope === 'workspace' && target.gitignoreEntries.length > 0) {
        if (dryRun) {
          console.log(chalk.dim(`    .gitignore: would add ${target.gitignoreEntries.join(', ')}`));
        } else {
          const result = await ensureGitignore(cwd, target.gitignoreEntries);
          if (result.modified) {
            console.log(chalk.green(`    ✚ .gitignore`) + chalk.dim(` → ${target.gitignoreEntries.join(', ')}`));
          }
        }
      }

      // Generate & write files
      const files = target.generate(targetConfig, scope);
      let created = 0, updated = 0;

      for (const file of files) {
        const absPath = path.join(cwd, file.relativePath);
        let existing: string | null = null;
        try { existing = await fs.readFile(absPath, 'utf-8'); } catch {}

        if (existing === file.content) {
          console.log(chalk.dim(`    ─ ${file.relativePath}`));
          continue;
        }

        const isNew = existing === null;
        if (dryRun) {
          console.log((isNew ? chalk.green : chalk.yellow)(`    ${isNew ? '✚' : '✎'} ${file.relativePath} (would ${isNew ? 'create' : 'update'})`));
        } else {
          await fs.mkdir(path.dirname(absPath), { recursive: true });
          await fs.writeFile(absPath, file.content);
          console.log((isNew ? chalk.green : chalk.yellow)(`    ${isNew ? '✚' : '✎'} ${file.relativePath}`));
        }

        isNew ? created++ : updated++;
      }

      if (created === 0 && updated === 0) {
        console.log(chalk.dim('    (up-to-date)'));
      }
      console.log();
    }
  },
});
