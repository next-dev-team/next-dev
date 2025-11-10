import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

// Minimal web bridge: handle MessageChannel from host and say hello
// This enables the plugin to run inside the Tron web host via iframe.
let tronPort = null;
const pluginMeta = { name: 'Todo Plugin', version: '1.0.1' };

window.addEventListener('message', (event) => {
  const data = event?.data;
  if (data && data.type === 'tron:connect' && event.ports && event.ports[0]) {
    tronPort = event.ports[0];
    tronPort.onmessage = (e) => {
      // Future: handle messages from host (e.g., storage, permissions)
      // console.log('[todo-plugin] message from host', e.data);
    };
    tronPort.start();
    tronPort.postMessage({ type: 'tron:hello', payload: pluginMeta });
    // Expose a simple runtime flag for app code or debugging
    window.tronConnected = true;
  }
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)