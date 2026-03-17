/**
 * Settings Store — centralized app settings for DesignForge
 *
 * Manages:
 * - Appearance (theme, accent color)
 * - AI provider configuration (migrated from chat-store)
 * - Editor preferences (grid, snap, zoom)
 * - Keyboard shortcuts
 *
 * Persists to localStorage under `designforge:settings`.
 */

import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import {
  createProvider,
  type AIProvider,
  type ProviderConfig,
} from '@/ai-providers';

// ─── Types ──────────────────────────────────────────────────────────────────

export type ThemeMode = 'system' | 'light' | 'dark';
export type SettingsSection = 'appearance' | 'ai' | 'editor' | 'about';

export interface AppSettings {
  // Appearance
  theme: ThemeMode;

  // AI Provider
  providerConfig: ProviderConfig;

  // Editor
  showGrid: boolean;
  snapToGrid: boolean;
  gridSize: number;
  autoSave: boolean;
  autoSaveInterval: number; // in seconds

  // Canvas
  defaultZoom: number;
}

export interface SettingsState extends AppSettings {
  // ─── UI ─────────────────────────────────────────────────────────
  isOpen: boolean;
  activeSection: SettingsSection;

  // ─── Computed ───────────────────────────────────────────────────
  provider: AIProvider;

  // ─── Actions ──────────────────────────────────────────────────
  openSettings: (section?: SettingsSection) => void;
  closeSettings: () => void;
  toggleSettings: () => void;
  setActiveSection: (section: SettingsSection) => void;

  // Granular updates
  setTheme: (theme: ThemeMode) => void;
  updateProviderConfig: (config: Partial<ProviderConfig>) => void;
  setShowGrid: (show: boolean) => void;
  setSnapToGrid: (snap: boolean) => void;
  setGridSize: (size: number) => void;
  setAutoSave: (auto: boolean) => void;
  setAutoSaveInterval: (seconds: number) => void;
  setDefaultZoom: (zoom: number) => void;

  // Bulk
  resetSection: (section: SettingsSection) => void;
  resetAll: () => void;
}

// ─── Defaults ───────────────────────────────────────────────────────────────

const DEFAULTS: AppSettings = {
  theme: 'system',
  providerConfig: { type: 'mock' },
  showGrid: false,
  snapToGrid: true,
  gridSize: 8,
  autoSave: false,
  autoSaveInterval: 30,
  defaultZoom: 1,
};

const STORAGE_KEY = 'designforge:settings';
const LEGACY_PROVIDER_KEY = 'designforge:ai-provider';

// ─── Persistence ────────────────────────────────────────────────────────────

function loadSettings(): AppSettings {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return { ...DEFAULTS, ...JSON.parse(stored) };
    }
    // Migrate legacy provider config
    const legacyProvider = localStorage.getItem(LEGACY_PROVIDER_KEY);
    if (legacyProvider) {
      const config = JSON.parse(legacyProvider) as ProviderConfig;
      return { ...DEFAULTS, providerConfig: config };
    }
  } catch { /* ignore */ }
  return { ...DEFAULTS };
}

function saveSettings(settings: AppSettings): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    // Also keep legacy key in sync for existing chat-store consumers
    localStorage.setItem(LEGACY_PROVIDER_KEY, JSON.stringify(settings.providerConfig));
  } catch { /* ignore */ }
}

function getAppSettings(state: SettingsState): AppSettings {
  return {
    theme: state.theme,
    providerConfig: state.providerConfig,
    showGrid: state.showGrid,
    snapToGrid: state.snapToGrid,
    gridSize: state.gridSize,
    autoSave: state.autoSave,
    autoSaveInterval: state.autoSaveInterval,
    defaultZoom: state.defaultZoom,
  };
}

// ─── Theme Application ──────────────────────────────────────────────────────

function applyTheme(theme: ThemeMode): void {
  const root = document.documentElement;
  root.removeAttribute('data-theme');
  root.style.removeProperty('color-scheme');

  if (theme === 'light') {
    root.setAttribute('data-theme', 'light');
    root.style.setProperty('color-scheme', 'light');
  } else if (theme === 'dark') {
    root.setAttribute('data-theme', 'dark');
    root.style.setProperty('color-scheme', 'dark');
  } else {
    // System — let the media query handle it
    root.style.setProperty('color-scheme', 'light dark');
  }
}

// ─── Store ──────────────────────────────────────────────────────────────────

export const useSettingsStore = create<SettingsState>()(
  subscribeWithSelector((set, get) => {
    const initial = loadSettings();
    const initialProvider = createProvider(initial.providerConfig);

    // Apply theme on initial load
    setTimeout(() => applyTheme(initial.theme), 0);

    return {
      ...initial,
      isOpen: false,
      activeSection: 'appearance',
      provider: initialProvider,

      openSettings: (section) =>
        set({ isOpen: true, activeSection: section ?? get().activeSection }),
      closeSettings: () => set({ isOpen: false }),
      toggleSettings: () => {
        const s = get();
        set({ isOpen: !s.isOpen });
      },
      setActiveSection: (section) => set({ activeSection: section }),

      setTheme: (theme) => {
        applyTheme(theme);
        set({ theme });
        saveSettings(getAppSettings({ ...get(), theme }));
      },

      updateProviderConfig: (partial) => {
        const current = get().providerConfig;
        const next = { ...current, ...partial };
        const provider = createProvider(next);
        set({ providerConfig: next, provider });
        saveSettings(getAppSettings({ ...get(), providerConfig: next }));
      },

      setShowGrid: (showGrid) => {
        set({ showGrid });
        saveSettings(getAppSettings({ ...get(), showGrid }));
      },
      setSnapToGrid: (snapToGrid) => {
        set({ snapToGrid });
        saveSettings(getAppSettings({ ...get(), snapToGrid }));
      },
      setGridSize: (gridSize) => {
        set({ gridSize });
        saveSettings(getAppSettings({ ...get(), gridSize }));
      },
      setAutoSave: (autoSave) => {
        set({ autoSave });
        saveSettings(getAppSettings({ ...get(), autoSave }));
      },
      setAutoSaveInterval: (autoSaveInterval) => {
        set({ autoSaveInterval });
        saveSettings(getAppSettings({ ...get(), autoSaveInterval }));
      },
      setDefaultZoom: (defaultZoom) => {
        set({ defaultZoom });
        saveSettings(getAppSettings({ ...get(), defaultZoom }));
      },

      resetSection: (section) => {
        const updates: Partial<AppSettings> = {};
        switch (section) {
          case 'appearance':
            updates.theme = DEFAULTS.theme;
            applyTheme(DEFAULTS.theme);
            break;
          case 'ai':
            updates.providerConfig = { ...DEFAULTS.providerConfig };
            break;
          case 'editor':
            updates.showGrid = DEFAULTS.showGrid;
            updates.snapToGrid = DEFAULTS.snapToGrid;
            updates.gridSize = DEFAULTS.gridSize;
            updates.autoSave = DEFAULTS.autoSave;
            updates.autoSaveInterval = DEFAULTS.autoSaveInterval;
            updates.defaultZoom = DEFAULTS.defaultZoom;
            break;
        }
        set(updates as Partial<SettingsState>);
        saveSettings(getAppSettings({ ...get(), ...updates }));
      },

      resetAll: () => {
        applyTheme(DEFAULTS.theme);
        const provider = createProvider(DEFAULTS.providerConfig);
        set({ ...DEFAULTS, provider });
        saveSettings(DEFAULTS);
      },
    };
  }),
);
