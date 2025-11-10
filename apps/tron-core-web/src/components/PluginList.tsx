import React from 'react';
import type { PluginDescriptor } from '../types/plugins';

interface Props {
  plugins: PluginDescriptor[];
  onLoad: (plugin: PluginDescriptor) => void;
  onUnload: (pluginId: string) => void;
  isLoaded: (pluginId: string) => boolean;
}

export default function PluginList({ plugins, onLoad, onUnload, isLoaded }: Props) {
  return (
    <div className="card">
      <h2>Installed Plugins</h2>
      <div className="list">
        {plugins.length === 0 && <div className="muted">No plugins installed yet.</div>}
        {plugins.map(p => (
          <div key={p.id} className="item">
            <div>
              <div>{p.metadata.name} <span className="muted">v{p.metadata.version}</span></div>
              {p.uiUrl && <div className="muted">{p.uiUrl}</div>}
            </div>
            <div className="row">
              {!isLoaded(p.id) ? (
                <button className="btn primary" onClick={() => onLoad(p)}>Load</button>
              ) : (
                <button className="btn" onClick={() => onUnload(p.id)}>Unload</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}