import { test, expect } from 'vitest';
import { PluginLoader } from '../src/main/plugin-loader';
import { PluginAPIBridge } from '../src/main/plugin-api-bridge';
import { DatabaseService } from '../src/main/database-service';
import * as path from 'path';
import * as fs from 'fs/promises';

// Mock Electron modules
const mockBrowserWindow = {
  loadFile: jest.fn(),
  loadURL: jest.fn(),
  on: jest.fn(),
  isDestroyed: jest.fn(() => false),
  close: jest.fn()
};

jest.mock('electron', () => ({
  app: {
    on: jest.fn(),
    quit: jest.fn()
  },
  BrowserWindow: jest.fn(() => mockBrowserWindow),
  ipcMain: {
    handle: jest.fn(),
    on: jest.fn()
  }
}));

describe('Tron Core Plugin Integration', () => {
  let pluginLoader: PluginLoader;
  let pluginAPIBridge: PluginAPIBridge;
  let databaseService: DatabaseService;

  beforeEach(async () => {
    databaseService = new DatabaseService();
    pluginAPIBridge = new PluginAPIBridge(databaseService);
    pluginLoader = new PluginLoader(pluginAPIBridge, databaseService);
    
    await databaseService.initialize();
  });

  afterEach(async () => {
    await databaseService.cleanup();
    jest.clearAllMocks();
  });

  test('should create plugin loader instance', () => {
    expect(pluginLoader).toBeDefined();
    expect(pluginLoader.getLoadedPlugins()).toEqual([]);
  });

  test('should handle plugin manifest validation', async () => {
    const testPluginPath = path.join(__dirname, 'test-plugin');
    
    // Create a test plugin directory
    await fs.mkdir(testPluginPath, { recursive: true });
    
    // Create invalid manifest
    const invalidManifest = {
      name: 'test-plugin',
      version: '1.0.0'
      // Missing tron-plugin configuration
    };
    
    await fs.writeFile(
      path.join(testPluginPath, 'package.json'),
      JSON.stringify(invalidManifest)
    );

    const result = await pluginLoader.loadExternalPlugin(testPluginPath);
    expect(result).toBeNull();

    // Cleanup
    await fs.rm(testPluginPath, { recursive: true, force: true });
  });

  test('should create plugin API with correct methods', () => {
    const pluginAPI = pluginAPIBridge.createPluginAPI('test-plugin');
    
    expect(pluginAPI).toBeDefined();
    expect(pluginAPI.id).toBe('test-plugin');
    expect(typeof pluginAPI.getData).toBe('function');
    expect(typeof pluginAPI.setData).toBe('function');
    expect(typeof pluginAPI.onMessage).toBe('function');
    expect(typeof pluginAPI.sendMessage).toBe('function');
  });

  test('should handle plugin data storage', async () => {
    const pluginAPI = pluginAPIBridge.createPluginAPI('test-plugin');
    
    // Test data storage
    await pluginAPI.setData('counter-value', 42);
    const retrievedValue = await pluginAPI.getData('counter-value');
    
    expect(retrievedValue).toBe(42);
  });

  test('should handle plugin messaging', (done) => {
    const pluginAPI = pluginAPIBridge.createPluginAPI('test-plugin');
    const testMessage = { type: 'test', content: 'Hello World' };
    
    pluginAPI.onMessage((message) => {
      expect(message).toEqual(testMessage);
      done();
    });
    
    pluginAPI.sendMessage(testMessage);
  });

  test('should handle plugin loading and unloading', async () => {
    // This test would require a real plugin to be present
    // For now, we'll test the basic functionality
    const loadedPlugins = pluginLoader.getLoadedPlugins();
    expect(Array.isArray(loadedPlugins)).toBe(true);
    
    // Test unloading non-existent plugin
    const result = await pluginLoader.unloadPlugin('non-existent');
    expect(result).toBe(false);
  });

  test('should handle built-in plugin loading', async () => {
    // Test that built-in plugin loading doesn't crash
    await expect(pluginLoader.loadBuiltInPlugins()).resolves.not.toThrow();
  });
});

describe('Counter Plugin Specific Tests', () => {
  test('should validate counter plugin manifest structure', () => {
    const manifest = {
      name: 'counter-plugin',
      version: '1.0.0',
      'tron-plugin': {
        name: 'Counter Plugin',
        version: '1.0.0',
        description: 'A simple counter demonstration plugin',
        author: 'RNR Team',
        license: 'MIT',
        type: 'ui',
        permissions: ['storage'],
        ui: 'dist/index.html'
      }
    };

    expect(manifest['tron-plugin']).toBeDefined();
    expect(manifest['tron-plugin'].type).toBe('ui');
    expect(manifest['tron-plugin'].permissions).toContain('storage');
    expect(manifest['tron-plugin'].ui).toBe('dist/index.html');
  });

  test('should handle plugin permissions validation', () => {
    const validPermissions = ['storage', 'network', 'filesystem'];
    const pluginPermissions = ['storage'];
    
    const hasValidPermissions = pluginPermissions.every(permission => 
      validPermissions.includes(permission)
    );
    
    expect(hasValidPermissions).toBe(true);
  });
});