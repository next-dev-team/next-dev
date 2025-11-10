/* Tron Core Web Service Worker */
// Stores plugin assets in memory and serves them under /plugins/<id>/...

const PLUGINS = new Map(); // pluginId -> Map(pathname -> { data:ArrayBuffer, type:string })

self.addEventListener('message', (event) => {
  const msg = event.data || {};
  if (msg.type === 'tron:registerPlugin' && msg.pluginId && Array.isArray(msg.assets)) {
    const store = new Map();
    for (const asset of msg.assets) {
      // asset: { path, contentType, data:ArrayBuffer }
      if (asset && asset.path && asset.data) {
        store.set(asset.path, {
          data: asset.data,
          type: asset.contentType || 'application/octet-stream',
        });
      }
    }
    PLUGINS.set(msg.pluginId, store);
    // Optional ack
    event.ports?.[0]?.postMessage({ ok: true });
  }
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  if (url.pathname.startsWith('/plugins/')) {
    // /plugins/<id>/... => extract id and path remainder
    const [, , pluginId, ...rest] = url.pathname.split('/');
    const relPath = rest.join('/');
    const store = PLUGINS.get(pluginId);
    if (store) {
      const entry = store.get(relPath);
      if (entry) {
        event.respondWith(new Response(entry.data, { headers: { 'Content-Type': entry.type } }));
        return;
      }
    }
  }
});
