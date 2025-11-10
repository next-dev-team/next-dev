import React, { useEffect, useRef, useState } from 'react';
import './PluginManager.css';

interface PluginManagerProps {
  onPluginInstalled: () => void;
}

export const PluginManager: React.FC<PluginManagerProps> = ({ onPluginInstalled }) => {
  const [installPath, setInstallPath] = useState('');
  const [installing, setInstalling] = useState(false);
  const [error, setError] = useState('');
  const [electronReady, setElectronReady] = useState(false);
  const [status, setStatus] = useState('');
  const [resetting, setResetting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    // Initial check
    setElectronReady(!!window.electronAPI);

    if (window.electronAPI) {
      try {
        window.electronAPI.onPluginsLoaded(() => {
          setElectronReady(true);
        });
      } catch {}
    }

    // Ensure hidden file input supports directory selection in browsers
    if (fileInputRef.current) {
      try {
        fileInputRef.current.setAttribute('webkitdirectory', '');
        fileInputRef.current.setAttribute('directory', '');
      } catch {}
    }

    return () => {
      if (window.electronAPI) {
        try {
          window.electronAPI.removeAllListeners('plugins-loaded');
        } catch {}
      }
    };
  }, []);

  const handleInstallPlugin = async () => {
    if (!installPath.trim()) {
      setError('Please enter a plugin path');
      return;
    }

    if (!window.electronAPI) {
      setError('Electron API not available - preload script may not be loaded');
      return;
    }

    setInstalling(true);
    setError('');

    try {
      const result = await window.electronAPI.installPlugin(installPath);
      if (result.success) {
        setInstallPath('');
        onPluginInstalled();
      } else {
        setError(result.error || 'Failed to install plugin');
      }
    } catch (err) {
      setError('Error installing plugin: ' + (err as Error).message);
    } finally {
      setInstalling(false);
    }
  };

  const handleBrowsePlugin = async () => {
    setError('');
    setStatus('');
    // Prefer Electron's native dialog when available
    if (window.electronAPI && typeof window.electronAPI.openPluginDirectory === 'function') {
      try {
        const result = await window.electronAPI.openPluginDirectory();
        if (result.success && result.path) {
          setInstallPath(result.path);
        } else if (result.error) {
          setError(result.error);
        }
        return;
      } catch (e) {
        setError('Failed to open directory: ' + (e as Error).message);
        return;
      }
    }

    // Browser fallback: showDirectoryPicker (Chromium-based browsers)
    const anyWindow = window as any;
    if (typeof anyWindow.showDirectoryPicker === 'function') {
      try {
        const dirHandle = await anyWindow.showDirectoryPicker();
        // Browser security does not expose real filesystem paths; use the name for display
        setInstallPath(dirHandle.name || 'Selected Directory');
        setStatus('Directory selected in browser preview. Install requires Electron.');
        return;
      } catch (e) {
        setError('Directory selection cancelled or failed');
        return;
      }
    }

    // Legacy fallback: hidden file input with webkitdirectory
    if (fileInputRef.current) {
      fileInputRef.current.click();
    } else {
      setError('Directory selection not supported in this environment');
    }
  };

  const handleDirectoryInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) {
      return;
    }
    // Attempt to infer the directory name from webkitRelativePath
    const first = files[0] as any;
    const rel: string | undefined = first.webkitRelativePath || first.name;
    const dirName = rel?.split('/')?.[0] || 'Selected Directory';
    setInstallPath(dirName);
    setStatus('Directory selected in browser preview. Install requires Electron.');
  };

  const handleResetDatabase = async () => {
    if (!window.electronAPI) {
      setError('Electron API not available - preload script may not be loaded');
      return;
    }
    setResetting(true);
    setError('');
    setStatus('');
    try {
      const result = await window.electronAPI.resetDatabase();
      if (result.success) {
        setStatus(result.message || 'Database reset successfully');
        onPluginInstalled();
      } else {
        setError(result.error || 'Failed to reset database');
      }
    } catch (e) {
      setError('Error resetting database: ' + (e as Error).message);
    } finally {
      setResetting(false);
    }
  };

  const handleTestAPI = async () => {
    if (!window.electronAPI) {
      setError('Electron API not available - preload script may not be loaded');
      return;
    }
    setError('');
    setStatus('');
    try {
      const result = await window.electronAPI.testIPC();
      if (result.success) {
        setStatus(`IPC OK. Plugins count: ${result.pluginsCount ?? 0}`);
      } else {
        setError(result.error || 'IPC test failed');
      }
    } catch (e) {
      setError('IPC test error: ' + (e as Error).message);
    }
  };

  return (
    <div className="plugin-manager">
      <div className="install-section">
        <h3>Install Plugin</h3>
        <div className="install-form">
          <input
            type="text"
            placeholder="Enter plugin path or drag plugin folder here"
            value={installPath}
            onChange={(e) => setInstallPath(e.target.value)}
            className="plugin-path-input"
          />
          <button onClick={handleBrowsePlugin} className="browse-button" disabled={installing}>
            Browse
          </button>
          <button
            onClick={handleInstallPlugin}
            className="install-button"
            disabled={installing || !installPath.trim() || !electronReady}
          >
            {installing ? 'Installing...' : 'Install Plugin'}
          </button>
        </div>
        {!electronReady && (
          <div className="warning-message">
            Electron API not ready (browser preview). Use Electron app to install.
          </div>
        )}
        {error && <div className="error-message">{error}</div>}
        {status && <div className="status-message">{status}</div>}
      </div>

      <div className="plugin-info">
        <h3>Plugin Requirements</h3>
        <ul>
          <li>Plugin must have a package.json with name and version</li>
          <li>Plugin must have a dist folder with built files</li>
          <li>Plugin must export a default object with metadata</li>
          <li>Plugin code will be validated for security</li>
        </ul>
        <div className="actions">
          <button
            onClick={handleResetDatabase}
            className="reset-button"
            disabled={!electronReady || resetting}
          >
            {resetting ? 'Resetting...' : 'Reset Database'}
          </button>
          <button onClick={handleTestAPI} className="test-button" disabled={!electronReady}>
            Test API
          </button>
        </div>
        {/* Hidden input for legacy directory selection in browsers */}
        <input
          ref={fileInputRef}
          type="file"
          style={{ display: 'none' }}
          multiple
          onChange={handleDirectoryInputChange}
        />
      </div>
    </div>
  );
};
