import React, { useEffect, useMemo, useRef, useState } from 'react';
import PluginManager from './components/PluginManager';
import PluginList from './components/PluginList';
import { WebPluginLoader } from './runtime/web-plugin-loader';
import type { PluginDescriptor } from './types/plugins';

export default function App() {
  const loader = useMemo(() => new WebPluginLoader(), []);
  const [plugins, setPlugins] = useState<PluginDescriptor[]>([]);
  const [loading, setLoading] = useState(true);
  const viewRef = useRef<HTMLDivElement>(null);
  const [activePluginId, setActivePluginId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const list = await loader.list();
      setPlugins(list);
      setLoading(false);
    })();
  }, [loader]);

  async function refresh() {
    setPlugins(await loader.list());
  }

  async function handleLoad(plugin: PluginDescriptor) {
    if (!viewRef.current) return;
    const ok = await loader.load(plugin, viewRef.current);
    if (ok) setActivePluginId(plugin.id);
    await refresh();
  }

  async function handleUnload(pluginId: string) {
    await loader.unload(pluginId);
    if (activePluginId === pluginId) setActivePluginId(null);
    if (viewRef.current) viewRef.current.innerHTML = '';
    await refresh();
  }

  const isLoaded = (id: string) => plugins.find((p) => p.id === id)?.status === 'loaded';

  if (loading) {
    return (
      <div className="app">
        <div className="card">Loading Tron Core Web…</div>
      </div>
    );
  }

  return (
    <div className="app">
      <div className="header">
        <div className="title">Tron Core Web</div>
        <div className="muted">Plugin host for the browser</div>
      </div>
      <div className="grid">
        <PluginManager loader={loader} onPluginInstalled={refresh} />
        <div className="card">
          <h2>Plugin View</h2>
          <div ref={viewRef} />
        </div>
      </div>
      <PluginList
        plugins={plugins}
        onLoad={handleLoad}
        onUnload={handleUnload}
        isLoaded={isLoaded}
      />
    </div>
  );
}
