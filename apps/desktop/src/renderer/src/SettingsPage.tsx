/**
 * SettingsPage — Full-page overlay settings for DesignForge
 *
 * Features:
 * - Sidebar navigation with section categories
 * - Appearance: Theme mode selector (System / Light / Dark)
 * - AI Provider: Provider type, base URL, model, API key
 * - Editor: Grid, snap, auto-save, default zoom
 * - About: Version info and links
 * - Keyboard shortcut: Ctrl+, to open
 */

import { useEffect, useCallback, useState } from 'react';
import { useSettingsStore, type ThemeMode, type SettingsSection } from '@/settings-store';
import type { ProviderType } from '@/ai-providers';
import {
  X,
  Sun,
  Moon,
  Monitor,
  Palette,
  Bot,
  Settings,
  Info,
  Zap,
  Globe,
  Server,
  Grid3X3,
  Magnet,
  Save,
  RotateCcw,
  Check,
} from 'lucide-react';

// ─── Section Navigation Config ──────────────────────────────────────────────

const SECTIONS: { id: SettingsSection; label: string; icon: typeof Settings }[] = [
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'ai', label: 'AI Provider', icon: Bot },
  { id: 'editor', label: 'Editor', icon: Grid3X3 },
  { id: 'about', label: 'About', icon: Info },
];

// ─── Theme Icons ────────────────────────────────────────────────────────────

const THEME_OPTIONS: { value: ThemeMode; label: string; icon: typeof Sun; description: string }[] = [
  { value: 'system', label: 'System', icon: Monitor, description: 'Follow OS preference' },
  { value: 'light', label: 'Light', icon: Sun, description: 'Always use light theme' },
  { value: 'dark', label: 'Dark', icon: Moon, description: 'Always use dark theme' },
];

// ─── Provider Config ────────────────────────────────────────────────────────

const PROVIDERS: { type: ProviderType; label: string; icon: typeof Zap; description: string }[] = [
  { type: 'mock', label: 'Mock (Offline)', icon: Zap, description: 'Heuristic parsing, no API needed' },
  { type: 'openai', label: 'OpenAI / Local LLM', icon: Globe, description: 'OpenAI, Ollama, LM Studio, or compatible' },
  { type: 'mcp', label: 'MCP Server', icon: Server, description: 'Routes through DesignForge MCP via Electron IPC' },
];

// ─── Appearance Section ─────────────────────────────────────────────────────

function AppearanceSection() {
  const theme = useSettingsStore((s) => s.theme);
  const setTheme = useSettingsStore((s) => s.setTheme);

  return (
    <div className="settings-content">
      <div className="settings-section-header">
        <h2 className="settings-section-title">Appearance</h2>
        <p className="settings-section-desc">Customize how DesignForge looks and feels.</p>
      </div>

      <div className="settings-group">
        <div className="settings-group-title">Theme</div>
        <div className="settings-theme-grid">
          {THEME_OPTIONS.map((opt) => {
            const Icon = opt.icon;
            const isActive = theme === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                className="settings-theme-card"
                data-active={isActive}
                onClick={() => setTheme(opt.value)}
              >
                <div className="settings-theme-card-icon">
                  <Icon size={20} />
                </div>
                <div className="settings-theme-card-label">{opt.label}</div>
                <div className="settings-theme-card-desc">{opt.description}</div>
                {isActive && (
                  <div className="settings-theme-card-check">
                    <Check size={12} />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── AI Provider Section ────────────────────────────────────────────────────

interface MCPToolInfo {
  name: string;
  description: string;
}

function MCPStatus() {
  const [connected, setConnected] = useState(false);
  const [tools, setTools] = useState<MCPToolInfo[]>([]);
  const [serverPath, setServerPath] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [bridgeAvailable, setBridgeAvailable] = useState<boolean | null>(null);

  const getMcp = useCallback(() => {
    const w = window as unknown as {
      designforge?: {
        mcp?: {
          status(): Promise<{ connected: boolean; serverPath: string; tools: MCPToolInfo[] }>;
          connect(): Promise<{ success: boolean; error?: string; tools?: MCPToolInfo[] }>;
          disconnect(): Promise<{ success: boolean }>;
          listTools(): Promise<MCPToolInfo[]>;
        };
      };
    };
    return w.designforge?.mcp ?? null;
  }, []);

  const refresh = useCallback(async () => {
    const mcp = getMcp();
    if (!mcp) {
      setBridgeAvailable(false);
      return;
    }
    setBridgeAvailable(true);
    try {
      const status = await mcp.status();
      setConnected(status.connected);
      setServerPath(status.serverPath);
      setTools(status.tools);
    } catch (err) {
      console.error('[MCP UI] Status error:', err);
    }
  }, [getMcp]);

  useEffect(() => { refresh(); }, [refresh]);

  const handleConnect = async () => {
    const mcp = getMcp();
    if (!mcp) return;
    setLoading(true);
    setError('');
    try {
      const result = await mcp.connect();
      if (!result.success) {
        setError(result.error ?? 'Failed to connect');
      }
    } catch (err) {
      setError((err as Error).message);
    }
    setLoading(false);
    await refresh();
  };

  const handleDisconnect = async () => {
    const mcp = getMcp();
    if (!mcp) return;
    await mcp.disconnect();
    await refresh();
  };

  if (bridgeAvailable === false) {
    return (
      <div className="settings-mcp-empty">
        <Server size={24} style={{ opacity: 0.4 }} />
        <div>Electron bridge not available</div>
        <div className="settings-hint" style={{ marginTop: 4 }}>
          MCP requires the Electron desktop app.
        </div>
      </div>
    );
  }

  return (
    <div className="settings-mcp-servers">
      <div className="settings-mcp-server" data-connected={connected}>
        <div className="settings-mcp-server-header">
          <div className="settings-mcp-server-status" data-connected={connected} />
          <div className="settings-mcp-server-info">
            <div className="settings-mcp-server-name">designforge</div>
            <div className="settings-mcp-server-meta">
              {connected
                ? `${tools.length} tool${tools.length !== 1 ? 's' : ''} ready`
                : bridgeAvailable === null ? 'Checking...' : 'Not connected'
              }
            </div>
          </div>
          <div className="settings-mcp-server-actions">
            {connected ? (
              <button
                type="button"
                className="settings-mcp-btn settings-mcp-btn-disconnect"
                onClick={handleDisconnect}
              >
                Disconnect
              </button>
            ) : (
              <button
                type="button"
                className="settings-mcp-btn settings-mcp-btn-connect"
                disabled={loading}
                onClick={handleConnect}
              >
                {loading ? 'Starting...' : 'Connect'}
              </button>
            )}
          </div>
        </div>
        {error && <div className="settings-mcp-error">{error}</div>}
        {serverPath && (
          <div className="settings-hint" style={{ padding: '0 14px 8px', fontSize: '0.65rem' }}>
            {serverPath}
          </div>
        )}
        {connected && tools.length > 0 && (
          <div className="settings-mcp-tools">
            {tools.map((t) => (
              <div key={t.name} className="settings-mcp-tool">
                <span className="settings-mcp-tool-name">{t.name}</span>
                {t.description && (
                  <span className="settings-mcp-tool-desc">{t.description}</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function AIProviderSection() {
  const config = useSettingsStore((s) => s.providerConfig);
  const updateConfig = useSettingsStore((s) => s.updateProviderConfig);

  return (
    <div className="settings-content">
      <div className="settings-section-header">
        <h2 className="settings-section-title">AI Provider</h2>
        <p className="settings-section-desc">Configure the AI backend for chat and generation.</p>
      </div>

      <div className="settings-group">
        <div className="settings-group-title">Provider</div>
        <div className="settings-provider-grid">
          {PROVIDERS.map((p) => {
            const Icon = p.icon;
            const isActive = config.type === p.type;
            return (
              <button
                key={p.type}
                type="button"
                className="settings-provider-card"
                data-active={isActive}
                onClick={() => updateConfig({ type: p.type })}
              >
                <div className="settings-provider-card-icon">
                  <Icon size={16} />
                </div>
                <div className="settings-provider-card-info">
                  <div className="settings-provider-card-label">{p.label}</div>
                  <div className="settings-provider-card-desc">{p.description}</div>
                </div>
                {isActive && (
                  <div className="settings-provider-card-check">
                    <Check size={12} />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {config.type === 'openai' && (
        <div className="settings-group">
          <div className="settings-group-title">Connection</div>
          <div className="settings-field">
            <label className="settings-label" htmlFor="settings-base-url">Base URL</label>
            <input
              id="settings-base-url"
              className="settings-input"
              value={config.baseUrl ?? 'http://localhost:11434/v1'}
              placeholder="http://localhost:11434/v1"
              onChange={(e) => updateConfig({ baseUrl: e.target.value })}
            />
            <span className="settings-hint">The API endpoint. Works with Ollama, LM Studio, etc.</span>
          </div>
          <div className="settings-field">
            <label className="settings-label" htmlFor="settings-model">Model</label>
            <input
              id="settings-model"
              className="settings-input"
              value={config.model ?? ''}
              placeholder="llama3, gpt-4o, etc."
              onChange={(e) => updateConfig({ model: e.target.value })}
            />
          </div>
          <div className="settings-field">
            <label className="settings-label" htmlFor="settings-api-key">API Key</label>
            <input
              id="settings-api-key"
              className="settings-input"
              type="password"
              value={config.apiKey ?? ''}
              placeholder="sk-... (optional for local models)"
              onChange={(e) => updateConfig({ apiKey: e.target.value })}
            />
          </div>
        </div>
      )}

      {config.type === 'mcp' && (
        <>
          <div className="settings-group">
            <div className="settings-group-title">MCP Server</div>
            <div className="settings-group-desc">
              Auto-spawns the DesignForge MCP server from packages/mcp-server.
              External agents (Claude Code, Cursor) can also connect to this server.
            </div>
            <MCPStatus />
          </div>

          <div className="settings-group">
            <div className="settings-group-title">LLM Backend</div>
            <div className="settings-group-desc">
              An LLM interprets your prompts and decides which MCP tools to call.
              Configure an OpenAI-compatible endpoint (Ollama, LM Studio, etc.)
            </div>
            <div className="settings-field">
              <label className="settings-label" htmlFor="settings-mcp-base-url">Base URL</label>
              <input
                id="settings-mcp-base-url"
                className="settings-input"
                value={config.baseUrl ?? 'http://localhost:11434/v1'}
                placeholder="http://localhost:11434/v1"
                onChange={(e) => updateConfig({ baseUrl: e.target.value })}
              />
              <span className="settings-hint">Leave default for Ollama. Use https://api.openai.com/v1 for OpenAI.</span>
            </div>
            <div className="settings-field">
              <label className="settings-label" htmlFor="settings-mcp-model">Model</label>
              <input
                id="settings-mcp-model"
                className="settings-input"
                value={config.model ?? ''}
                placeholder="llama3, gpt-4o, qwen2.5, etc."
                onChange={(e) => updateConfig({ model: e.target.value })}
              />
            </div>
            <div className="settings-field">
              <label className="settings-label" htmlFor="settings-mcp-api-key">API Key</label>
              <input
                id="settings-mcp-api-key"
                className="settings-input"
                type="password"
                value={config.apiKey ?? ''}
                placeholder="sk-... (optional for local models)"
                onChange={(e) => updateConfig({ apiKey: e.target.value })}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ─── Editor Section ─────────────────────────────────────────────────────────

function EditorSection() {
  const showGrid = useSettingsStore((s) => s.showGrid);
  const snapToGrid = useSettingsStore((s) => s.snapToGrid);
  const gridSize = useSettingsStore((s) => s.gridSize);
  const autoSave = useSettingsStore((s) => s.autoSave);
  const autoSaveInterval = useSettingsStore((s) => s.autoSaveInterval);
  const defaultZoom = useSettingsStore((s) => s.defaultZoom);

  const setShowGrid = useSettingsStore((s) => s.setShowGrid);
  const setSnapToGrid = useSettingsStore((s) => s.setSnapToGrid);
  const setGridSize = useSettingsStore((s) => s.setGridSize);
  const setAutoSave = useSettingsStore((s) => s.setAutoSave);
  const setAutoSaveInterval = useSettingsStore((s) => s.setAutoSaveInterval);
  const setDefaultZoom = useSettingsStore((s) => s.setDefaultZoom);

  return (
    <div className="settings-content">
      <div className="settings-section-header">
        <h2 className="settings-section-title">Editor</h2>
        <p className="settings-section-desc">Canvas and editing preferences.</p>
      </div>

      <div className="settings-group">
        <div className="settings-group-title">Canvas</div>

        <div className="settings-row">
          <div className="settings-row-info">
            <Grid3X3 size={16} className="settings-row-icon" />
            <div>
              <div className="settings-row-label">Show Grid</div>
              <div className="settings-row-desc">Display grid lines on the canvas</div>
            </div>
          </div>
          <label className="settings-toggle" htmlFor="toggle-grid">
            <input
              id="toggle-grid"
              type="checkbox"
              checked={showGrid}
              onChange={(e) => setShowGrid(e.target.checked)}
            />
            <span className="settings-toggle-slider" />
          </label>
        </div>

        <div className="settings-row">
          <div className="settings-row-info">
            <Magnet size={16} className="settings-row-icon" />
            <div>
              <div className="settings-row-label">Snap to Grid</div>
              <div className="settings-row-desc">Align elements to the nearest grid point</div>
            </div>
          </div>
          <label className="settings-toggle" htmlFor="toggle-snap">
            <input
              id="toggle-snap"
              type="checkbox"
              checked={snapToGrid}
              onChange={(e) => setSnapToGrid(e.target.checked)}
            />
            <span className="settings-toggle-slider" />
          </label>
        </div>

        <div className="settings-row">
          <div className="settings-row-info">
            <div>
              <div className="settings-row-label">Grid Size</div>
              <div className="settings-row-desc">Spacing between grid lines (px)</div>
            </div>
          </div>
          <input
            type="number"
            className="settings-input settings-input-sm"
            value={gridSize}
            min={2}
            max={64}
            onChange={(e) => setGridSize(Number(e.target.value))}
          />
        </div>

        <div className="settings-row">
          <div className="settings-row-info">
            <div>
              <div className="settings-row-label">Default Zoom</div>
              <div className="settings-row-desc">Initial zoom level for the canvas</div>
            </div>
          </div>
          <select
            className="settings-select"
            value={defaultZoom}
            onChange={(e) => setDefaultZoom(Number(e.target.value))}
          >
            <option value={0.5}>50%</option>
            <option value={0.75}>75%</option>
            <option value={1}>100%</option>
            <option value={1.25}>125%</option>
            <option value={1.5}>150%</option>
            <option value={2}>200%</option>
          </select>
        </div>
      </div>

      <div className="settings-group">
        <div className="settings-group-title">File</div>

        <div className="settings-row">
          <div className="settings-row-info">
            <Save size={16} className="settings-row-icon" />
            <div>
              <div className="settings-row-label">Auto Save</div>
              <div className="settings-row-desc">Automatically save changes periodically</div>
            </div>
          </div>
          <label className="settings-toggle" htmlFor="toggle-autosave">
            <input
              id="toggle-autosave"
              type="checkbox"
              checked={autoSave}
              onChange={(e) => setAutoSave(e.target.checked)}
            />
            <span className="settings-toggle-slider" />
          </label>
        </div>

        {autoSave && (
          <div className="settings-row">
            <div className="settings-row-info">
              <div>
                <div className="settings-row-label">Auto Save Interval</div>
                <div className="settings-row-desc">Save every N seconds</div>
              </div>
            </div>
            <input
              type="number"
              className="settings-input settings-input-sm"
              value={autoSaveInterval}
              min={5}
              max={300}
              step={5}
              onChange={(e) => setAutoSaveInterval(Number(e.target.value))}
            />
          </div>
        )}
      </div>
    </div>
  );
}

// ─── About Section ──────────────────────────────────────────────────────────

function AboutSection() {
  const resetAll = useSettingsStore((s) => s.resetAll);

  return (
    <div className="settings-content">
      <div className="settings-section-header">
        <h2 className="settings-section-title">About</h2>
        <p className="settings-section-desc">DesignForge desktop application</p>
      </div>

      <div className="settings-group">
        <div className="settings-about-card">
          <div className="settings-about-logo">⚡</div>
          <div className="settings-about-name">DesignForge</div>
          <div className="settings-about-version">v0.1.0-alpha</div>
          <div className="settings-about-desc">
            AI-powered design editor for building React Native UIs.
            <br />Part of the next-dev monorepo.
          </div>
        </div>

        <div className="settings-about-links">
          <div className="settings-about-link-row">
            <span className="settings-about-link-label">Platform</span>
            <span className="settings-about-link-value">Electron + React</span>
          </div>
          <div className="settings-about-link-row">
            <span className="settings-about-link-label">Renderer</span>
            <span className="settings-about-link-value">json-render</span>
          </div>
          <div className="settings-about-link-row">
            <span className="settings-about-link-label">Package</span>
            <span className="settings-about-link-value">@next-dev/desktop</span>
          </div>
        </div>
      </div>

      <div className="settings-group">
        <div className="settings-group-title">Danger Zone</div>
        <button
          type="button"
          className="settings-reset-btn"
          onClick={resetAll}
        >
          <RotateCcw size={14} />
          Reset All Settings
        </button>
      </div>
    </div>
  );
}

// ─── Section Router ─────────────────────────────────────────────────────────

function SectionContent({ section }: { section: SettingsSection }) {
  switch (section) {
    case 'appearance': return <AppearanceSection />;
    case 'ai': return <AIProviderSection />;
    case 'editor': return <EditorSection />;
    case 'about': return <AboutSection />;
    default: return null;
  }
}

// ─── Settings Page ──────────────────────────────────────────────────────────

export function SettingsPage() {
  const isOpen = useSettingsStore((s) => s.isOpen);
  const activeSection = useSettingsStore((s) => s.activeSection);
  const closeSettings = useSettingsStore((s) => s.closeSettings);
  const setActiveSection = useSettingsStore((s) => s.setActiveSection);

  // Close on Escape
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        e.preventDefault();
        e.stopPropagation();
        closeSettings();
      }
    },
    [isOpen, closeSettings],
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [handleKeyDown]);

  if (!isOpen) return null;

  return (
    <div className="settings-overlay" onClick={closeSettings} onKeyDown={() => {}} role="presentation">
      <div className="settings-page" onClick={(e) => e.stopPropagation()} onKeyDown={() => {}} role="dialog" aria-label="Settings">
        {/* Sidebar */}
        <aside className="settings-sidebar">
          <div className="settings-sidebar-header">
            <Settings size={16} />
            <span>Settings</span>
          </div>
          <nav className="settings-nav">
            {SECTIONS.map((sec) => {
              const Icon = sec.icon;
              return (
                <button
                  key={sec.id}
                  type="button"
                  className="settings-nav-item"
                  data-active={activeSection === sec.id}
                  onClick={() => setActiveSection(sec.id)}
                >
                  <Icon size={16} />
                  <span>{sec.label}</span>
                </button>
              );
            })}
          </nav>
          <div className="settings-sidebar-footer">
            <span className="settings-shortcut-hint">Ctrl+, to toggle</span>
          </div>
        </aside>

        {/* Content */}
        <main className="settings-main">
          <div className="settings-main-header">
            <h1 className="settings-main-title">
              {SECTIONS.find((s) => s.id === activeSection)?.label}
            </h1>
            <button type="button" className="settings-close-btn" onClick={closeSettings}>
              <X size={16} />
            </button>
          </div>
          <div className="settings-main-body">
            <SectionContent section={activeSection} />
          </div>
        </main>
      </div>
    </div>
  );
}
