import React, { useState } from 'react';
import { WebPluginLoader } from '../runtime/web-plugin-loader';

interface Props {
  loader: WebPluginLoader;
  onPluginInstalled: () => void;
}

export default function PluginManager({ loader, onPluginInstalled }: Props) {
  const [url, setUrl] = useState('');
  const [installing, setInstalling] = useState(false);
  const [error, setError] = useState('');
  const [folderInstalling, setFolderInstalling] = useState(false);

  async function install() {
    setInstalling(true);
    setError('');
    try {
      await loader.installFromUrl(url);
      setUrl('');
      onPluginInstalled();
    } catch (e: any) {
      setError(e?.message || 'Failed to install plugin');
    } finally {
      setInstalling(false);
    }
  }

  return (
    <div className="card">
      <h2>Install Plugin</h2>
      <div className="row">
        <input className="input" placeholder="https://host/plugin/index.html" value={url} onChange={e => setUrl(e.target.value)} />
        <button className="btn primary" onClick={install} disabled={!url || installing}>{installing ? 'Installing…' : 'Install'}</button>
      </div>
      {error && <div className="muted" style={{ color: 'var(--danger)', marginTop: 8 }}>{error}</div>}
      <div className="muted" style={{ marginTop: 8 }}>
        Provide the public URL to the plugin's built UI (index.html).
      </div>

      <div style={{ borderTop: '1px solid #1f2937', marginTop: 12, paddingTop: 12 }}>
        <div className="row" style={{ alignItems: 'center' }}>
          <input
            type="file"
            multiple
            // @ts-expect-error: vendor attribute supported in Chromium
            webkitdirectory="true"
            onChange={async (e) => {
              const files = e.target.files;
              if (!files || files.length === 0) return;
              setFolderInstalling(true);
              try {
                await loader.installFromDirectory(files);
                onPluginInstalled();
              } catch (e2: any) {
                setError(e2?.message || 'Failed to install from folder');
              } finally {
                setFolderInstalling(false);
                // Reset input so same folder can be re-selected
                e.target.value = '';
              }
            }}
          />
          <span className="muted">Select a built dist/ folder (like Tron Electron)</span>
        </div>
        {folderInstalling && <div className="muted" style={{ marginTop: 8 }}>Installing from folder…</div>}
      </div>
    </div>
  );
}