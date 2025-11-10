import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './styles.css';

// Register the service worker to serve local dist folders
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').catch((err) => {
    console.error('[sw] registration failed', err);
  });
}

const root = createRoot(document.getElementById('root')!);
root.render(<App />);