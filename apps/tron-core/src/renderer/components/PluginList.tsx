import React from 'react';
import './PluginList.css';

interface Plugin {
  id: string;
  name: string;
  version: string;
  description?: string;
  isActive: boolean;
}

interface PluginListProps {
  plugins: Plugin[];
  onLoadPlugin: (pluginId: string) => void;
  onUnloadPlugin: (pluginId: string) => void;
}

export const PluginList: React.FC<PluginListProps> = ({ 
  plugins, 
  onLoadPlugin, 
  onUnloadPlugin 
}) => {
  if (plugins.length === 0) {
    return (
      <div className="plugin-list-empty">
        <div className="empty-icon">🔌</div>
        <h3>No plugins installed</h3>
        <p>Install your first plugin using the plugin manager above.</p>
      </div>
    );
  }

  return (
    <div className="plugin-list">
      {plugins.map((plugin) => (
        <div key={plugin.id} className="plugin-card">
          <div className="plugin-header">
            <div className="plugin-info">
              <h3 className="plugin-name">{plugin.name}</h3>
              <span className="plugin-version">v{plugin.version}</span>
            </div>
            <div className={`plugin-status ${plugin.isActive ? 'active' : 'inactive'}`}>
              {plugin.isActive ? '● Active' : '○ Inactive'}
            </div>
          </div>
          
          {plugin.description && (
            <p className="plugin-description">{plugin.description}</p>
          )}
          
          <div className="plugin-actions">
            {plugin.isActive ? (
              <button 
                onClick={() => onUnloadPlugin(plugin.id)}
                className="action-button unload"
              >
                Unload
              </button>
            ) : (
              <button 
                onClick={() => onLoadPlugin(plugin.id)}
                className="action-button load"
              >
                Load
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};