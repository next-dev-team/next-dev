import { test, expect, describe, beforeAll, afterAll } from 'vitest';
import * as path from 'path';
import * as fs from 'fs/promises';
import { PluginLoader } from '../main/plugin-loader';

// These tests focus on entry point resolution and manifest loading only.
// They use a temporary plugin sandbox to avoid external path/env issues.

describe('PluginLoader entrypoint resolution', () => {
  const tmpRoot = path.resolve(__dirname, './__tmp_plugin__');
  const tmpDist = path.join(tmpRoot, 'dist');
  const tmpManifestRoot = {
    name: 'tmp-plugin',
    version: '1.0.0',
    description: 'Temporary Test Plugin',
    author: 'Test',
    license: 'MIT',
    'tron-plugin': {
      name: 'Temporary Plugin',
      version: '1.0.0',
      description: 'Temporary Test Plugin',
      author: 'Test',
      license: 'MIT',
      type: 'ui',
      permissions: ['storage'],
      ui: 'dist/index.html',
    },
  };

  const pluginJs = `"use strict";
  const plugin = {
    async initialize(api) { return true; },
    async destroy() { return true; }
  };
  module.exports = { plugin, default: plugin };
`;

  beforeAll(async () => {
    await fs.rm(tmpRoot, { recursive: true, force: true });
    await fs.mkdir(tmpDist, { recursive: true });
    await fs.writeFile(
      path.join(tmpRoot, 'package.json'),
      JSON.stringify(tmpManifestRoot, null, 2),
    );
    await fs.writeFile(
      path.join(tmpDist, 'package.json'),
      JSON.stringify(tmpManifestRoot, null, 2),
    );
    await fs.writeFile(path.join(tmpDist, 'plugin.js'), pluginJs);
    await fs.writeFile(
      path.join(tmpDist, 'index.html'),
      '<!doctype html><html><body>tmp</body></html>',
    );
  });

  afterAll(async () => {
    await fs.rm(tmpRoot, { recursive: true, force: true });
  });

  test('dist contains built UI, package.json, and plugin entries', async () => {
    const files = await fs.readdir(tmpDist);
    expect(files).toContain('index.html');
    expect(files).toContain('package.json');
    expect(files).toContain('plugin.js');
  });

  test('loadPluginManifest reads tron-plugin from package.json (root)', async () => {
    const loader = new PluginLoader(null as any, null as any, false);
    const manifestPath = path.join(tmpRoot, 'package.json');
    const manifest = await (loader as any).loadPluginManifest(manifestPath);
    expect(manifest).toBeTruthy();
    expect(manifest.name).toBe('tmp-plugin');
    expect(manifest.version).toBe('1.0.0');
    expect(manifest.type).toBe('ui');
  });

  test('loadPluginManifest reads tron-plugin from dist/package.json', async () => {
    const loader = new PluginLoader(null as any, null as any, false);
    const manifestPath = path.join(tmpDist, 'package.json');
    const manifest = await (loader as any).loadPluginManifest(manifestPath);
    expect(manifest).toBeTruthy();
    expect(manifest.name).toBe('tmp-plugin');
    expect(manifest.version).toBe('1.0.0');
    expect(manifest.type).toBe('ui');
  });

  test('loadPluginModule resolves when selecting plugin ROOT path', async () => {
    const loader = new PluginLoader(null as any, null as any, false);
    const manifest = { type: 'ui', ui: 'dist/index.html' };
    const mod = await (loader as any).loadPluginModule(tmpRoot, manifest);
    expect(mod).toBeTruthy();
    const pluginObj = mod.plugin || mod.default || mod;
    expect(pluginObj).toBeTruthy();
    expect(typeof pluginObj.initialize).toBe('function');
  });

  test('loadPluginModule resolves when selecting plugin DIST path', async () => {
    const loader = new PluginLoader(null as any, null as any, false);
    const manifest = { type: 'ui', ui: 'dist/index.html' };
    const mod = await (loader as any).loadPluginModule(tmpDist, manifest);
    expect(mod).toBeTruthy();
    const pluginObj = mod.plugin || mod.default || mod;
    expect(pluginObj).toBeTruthy();
    expect(typeof pluginObj.initialize).toBe('function');
  });
});
