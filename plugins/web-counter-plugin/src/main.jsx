import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

// Minimal web bridge: handle MessageChannel from host and say hello
let tronPort = null;
const pluginMeta = { name: 'Web Counter Plugin', version: '0.1.0' };

window.addEventListener('message', (event) => {
  const data = event?.data;
  if (data && data.type === 'tron:connect' && event.ports && event.ports[0]) {
    tronPort = event.ports[0];
    tronPort.onmessage = (e) => {
      // Future: handle messages from host (e.g., storage)
    };
    tronPort.start();
    tronPort.postMessage({ type: 'tron:hello', payload: pluginMeta });
    window.tronConnected = true;
  }
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
