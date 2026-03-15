import { defineCommand } from 'citty';
import os from 'node:os';
import path from 'node:path';
import chalk from 'chalk';
import { scanAgentsDir, mergeConfigs } from '../scanner.js';
import { detectInstalledTools } from '../targets/registry.js';
import { loadRc } from '../rc.js';

export default defineCommand({
  meta: {
    name: 'status',
    description: 'Show .agents config and detected IDE tools',
  },
  async run() {
    const cwd = process.cwd();
    const home = os.homedir();

    console.log(chalk.bold('\n📋 agent-cli status\n'));

    // Scan global + workspace
    const globalConfig = await scanAgentsDir(path.join(home, '.agents'));
    const workspaceConfig = await scanAgentsDir(path.join(cwd, '.agents'));
    const config = mergeConfigs(globalConfig, workspaceConfig);

    // Global skills
    if (globalConfig.skills.length > 0 || globalConfig.workflows.length > 0) {
      console.log(chalk.bold('  Global') + chalk.dim(` (~/.agents/):`));
      for (const s of globalConfig.skills) {
        console.log(`    ${chalk.green('●')} ${s.name}` + (s.description ? chalk.dim(` — ${s.description}`) : ''));
      }
      for (const w of globalConfig.workflows) {
        console.log(`    ${chalk.blue('◆')} ${w.name}` + (w.description ? chalk.dim(` — ${w.description}`) : ''));
      }
      console.log();
    }

    // Workspace skills
    if (workspaceConfig.skills.length > 0 || workspaceConfig.workflows.length > 0) {
      console.log(chalk.bold('  Workspace') + chalk.dim(` (.agents/):`));
      for (const s of workspaceConfig.skills) {
        console.log(`    ${chalk.green('●')} ${s.name}` + (s.description ? chalk.dim(` — ${s.description}`) : ''));
      }
      for (const w of workspaceConfig.workflows) {
        console.log(`    ${chalk.blue('◆')} ${w.name}` + (w.description ? chalk.dim(` — ${w.description}`) : ''));
      }
      console.log();
    }

    if (config.skills.length === 0 && config.workflows.length === 0) {
      console.log(chalk.yellow('  No skills or workflows found.\n'));
    }

    // MCP servers
    const mcpCount = Object.keys(config.mcpServers).length;
    if (mcpCount > 0) {
      console.log(chalk.bold('  MCP Servers:'));
      for (const [name, server] of Object.entries(config.mcpServers)) {
        const type = server.type ?? (server.command ? 'stdio' : 'http');
        const endpoint = server.url ?? server.command ?? '';
        console.log(`    ${chalk.magenta('◈')} ${name}` + chalk.dim(` — ${type} ${endpoint}`));
      }
      console.log();
    }

    // Detected tools
    const tools = await detectInstalledTools(home, cwd);
    console.log(chalk.bold('  Detected IDEs:'));
    for (const t of tools) {
      const icon = t.detected ? chalk.green('✓') : chalk.dim('✗');
      const text = t.detected ? chalk.white(t.label) : chalk.dim(t.label);
      console.log(`    ${icon} ${text}` + (t.detected ? chalk.dim(` — ${t.reason}`) : ''));
    }

    // RC config
    const { rc, filePath: rcPath } = await loadRc(cwd);
    if (rcPath) {
      console.log(chalk.bold('  Config') + chalk.dim(` (${path.basename(rcPath)}):`));
      if (rc.targets.length > 0) console.log(chalk.dim(`    targets:   ${rc.targets.join(', ')}`));
      console.log(chalk.dim(`    scope:     ${rc.scope}`));
      console.log(chalk.dim(`    gitignore: ${rc.gitignore}`));
      console.log(chalk.dim(`    mcp:       ${rc.mcp}`));
      console.log(chalk.dim(`    rootFiles: ${rc.rootFiles.join(', ')}`));
      console.log();
    }

    console.log(chalk.dim('  Run `agent-cli sync` to sync to all detected IDEs.\n'));
  },
});
