import React, { useState, useEffect } from 'react';
import { PluginManager } from './components/PluginManager';
import { PluginList } from './components/PluginList';
import './App.css';

interface Plugin {
  id: string;
  name: string;
  version: string;
  description?: string;
  isActive: boolean;
}

function App() {
  const [plugins, setPlugins] = useState<Plugin[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPlugins();

    // Listen for plugin updates
    if (window.electronAPI) {
      window.electronAPI.onPluginsLoaded((loadedPlugins: string[]) => {
        console.log('Plugins loaded:', loadedPlugins);
        loadPlugins();
      });
    }

    return () => {
      if (window.electronAPI) {
        window.electronAPI.removeAllListeners('plugins-loaded');
      }
    };
  }, []);

  const loadPlugins = async () => {
    try {
      if (window.electronAPI) {
        const loadedPlugins = await window.electronAPI.getPlugins();
        setPlugins(loadedPlugins);
      }
    } catch (error) {
      console.error('Failed to load plugins:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadPlugin = async (pluginId: string) => {
    try {
      const result = await window.electronAPI.loadPlugin(pluginId);
      if (result.success) {
        loadPlugins();
      } else {
        console.error('Failed to load plugin:', result.error);
      }
    } catch (error) {
      console.error('Error loading plugin:', error);
    }
  };

  const handleUnloadPlugin = async (pluginId: string) => {
    try {
      const result = await window.electronAPI.unloadPlugin(pluginId);
      if (result.success) {
        loadPlugins();
      } else {
        console.error('Failed to unload plugin:', result.error);
      }
    } catch (error) {
      console.error('Error unloading plugin:', error);
    }
  };

  if (loading) {
    return (
      <div className="app-loading">
        <div className="loading-spinner"></div>
        <p>Loading Tron Core...</p>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Tron Core</h1>
        <p>Plugin-based Electron Application</p>
      </header>

      <main className="app-main">
        <div className="app-content">
          <section className="plugin-section">
            <h2>Plugin Manager</h2>
            <PluginManager onPluginInstalled={loadPlugins} />
          </section>

          <section className="plugin-section">
            <h2>Installed Plugins</h2>
            <PluginList
              plugins={plugins}
              onLoadPlugin={handleLoadPlugin}
              onUnloadPlugin={handleUnloadPlugin}
            />
          </section>
        </div>
      </main>
    </div>
  );
}

export default App;
