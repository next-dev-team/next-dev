import { describe, it, expect, beforeAll } from 'vitest';
import { execSync } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';

const OUTPUTS_DIR = path.join(import.meta.dirname, 'outputs');
const CLI_PATH = path.join(import.meta.dirname, '..', 'src', 'index.ts');

function projectPath(name: string, rel: string) {
  return path.join(OUTPUTS_DIR, name, rel);
}

async function readFile(name: string, rel: string) {
  return fs.readFile(projectPath(name, rel), 'utf-8');
}

async function fileExists(name: string, rel: string) {
  try { await fs.access(projectPath(name, rel)); return true; } catch { return false; }
}

// ─── 1. Pre-template (vite default — no network) ───────────

describe('E2E: create with pre-template (vite)', () => {
  const NAME = 'counter-vite';

  beforeAll(async () => {
    await fs.mkdir(OUTPUTS_DIR, { recursive: true });
    await fs.rm(path.join(OUTPUTS_DIR, NAME), { recursive: true, force: true });
    execSync(`npx tsx ${CLI_PATH} create ${NAME}`, {
      cwd: OUTPUTS_DIR,
      stdio: 'pipe',
      timeout: 30_000,
    });
  }, 60_000);

  it('has full project structure', async () => {
    const expected = [
      'package.json', 'vite.config.ts', 'tsconfig.json', 'index.html',
      'src/App.tsx', 'src/App.css', 'src/main.tsx', 'src/index.css',
      '.agents/AGENTS.md', '.agents/SKILLS.md', '.agents/mcp.json', '.agentrc',
    ];
    for (const file of expected) {
      expect(await fileExists(NAME, file), `Missing: ${file}`).toBe(true);
    }
  });

  it('package.json has correct name and scripts', async () => {
    const pkg = JSON.parse(await readFile(NAME, 'package.json'));
    expect(pkg.name).toBe('counter-vite');
    expect(pkg.scripts.dev).toBe('vite');
    expect(pkg.scripts.build).toBeDefined();
    expect(pkg.dependencies.react).toBeDefined();
  });

  it('index.html has project title and root div', async () => {
    const html = await readFile(NAME, 'index.html');
    expect(html).toContain('<title>counter-vite</title>');
    expect(html).toContain('<div id="root">');
  });

  it('App.tsx has project name and counter', async () => {
    const app = await readFile(NAME, 'src/App.tsx');
    expect(app).toContain('counter-vite');
    expect(app).toContain('useState');
    expect(app).toContain('count');
  });

  it('AGENTS.md has Vite + React context', async () => {
    const md = await readFile(NAME, '.agents/AGENTS.md');
    expect(md).toContain('# counter-vite');
    expect(md).toContain('Vite');
    expect(md).toContain('React');
  });
});

// ─── 2. Custom provider -p (official create-vite CLI) ───────

describe('E2E: create with custom provider -p', () => {
  const NAME = 'counter-custom';

  beforeAll(async () => {
    await fs.mkdir(OUTPUTS_DIR, { recursive: true });
    await fs.rm(path.join(OUTPUTS_DIR, NAME), { recursive: true, force: true });
    execSync(
      `npx tsx ${CLI_PATH} create ${NAME} -p "npx -y create-vite@latest {{DIR}} --template react-ts"`,
      { cwd: OUTPUTS_DIR, stdio: 'pipe', timeout: 60_000 },
    );
  }, 90_000);

  it('has full project structure', async () => {
    const expected = [
      'package.json', 'vite.config.ts', 'tsconfig.json', 'index.html',
      'src/App.tsx', 'src/main.tsx',
      '.agents/AGENTS.md', '.agents/SKILLS.md', '.agents/mcp.json', '.agentrc',
    ];
    for (const file of expected) {
      expect(await fileExists(NAME, file), `Missing: ${file}`).toBe(true);
    }
  });

  it('package.json from create-vite has correct name', async () => {
    const pkg = JSON.parse(await readFile(NAME, 'package.json'));
    expect(pkg.name).toBe('counter-custom');
    expect(pkg.scripts.dev).toBeDefined();
  });

  it('agent config was layered on top of scaffold', async () => {
    const md = await readFile(NAME, '.agents/AGENTS.md');
    expect(md).toContain('# counter-custom');
  });
});
