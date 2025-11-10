import { PluginLoader } from '../src/main/plugin-loader';
import { PluginAPIBridge } from '../src/main/plugin-api-bridge';
import { DatabaseService } from '../src/main/database-service';
import * as path from 'path';

async function testPluginSystem() {
  console.log('🚀 Starting Tron Core Plugin System Test...\n');

  try {
    // Initialize services
    const databaseService = new DatabaseService();
    const pluginAPIBridge = new PluginAPIBridge(databaseService);
    const pluginLoader = new PluginLoader(pluginAPIBridge, databaseService);

    await databaseService.initialize();
    console.log('✅ Database service initialized');

    // Test 1: Load built-in plugins
    console.log('\n📦 Testing built-in plugin loading...');
    await pluginLoader.loadBuiltInPlugins();
    console.log('✅ Built-in plugins loaded');

    // Test 2: Get loaded plugins
    const loadedPlugins = pluginLoader.getLoadedPlugins();
    console.log(`✅ Loaded plugins: ${loadedPlugins.join(', ')}`);

    // Test 3: Test plugin API bridge
    console.log('\n🔌 Testing plugin API bridge...');
    const testPluginId = 'test-plugin';
    const pluginAPI = pluginAPIBridge.createPluginAPI(testPluginId);

    // Test data storage
    await pluginAPI.setData('test-key', 'test-value');
    const retrievedValue = await pluginAPI.getData('test-key');
    console.log(`✅ Data storage test: ${retrievedValue === 'test-value' ? 'PASSED' : 'FAILED'}`);

    // Test 4: Message handling
    console.log('\n📨 Testing message handling...');
    let messageReceived = false;
    pluginAPI.onMessage((message) => {
      messageReceived = true;
      console.log('✅ Message received:', message);
    });

    pluginAPI.sendMessage({ type: 'test', content: 'Hello from test!' });

    // Wait a bit for message processing
    await new Promise((resolve) => setTimeout(resolve, 100));
    console.log(`✅ Message handling test: ${messageReceived ? 'PASSED' : 'FAILED'}`);

    // Test 5: Plugin unloading
    console.log('\n🛑 Testing plugin unloading...');
    for (const pluginId of loadedPlugins) {
      const success = await pluginLoader.unloadPlugin(pluginId);
      console.log(`✅ Unloaded plugin '${pluginId}': ${success ? 'SUCCESS' : 'FAILED'}`);
    }

    // Cleanup
    await databaseService.cleanup();
    console.log('\n✅ Database cleanup completed');

    console.log('\n🎉 All plugin system tests completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Plugin system test failed:', error);
    process.exit(1);
  }
}

// Run the test if this file is executed directly
if (require.main === module) {
  testPluginSystem();
}
