import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './styles.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Register the service worker to serve local dist folders
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').catch((err) => {
    console.error('[sw] registration failed', err);
  });
}

const root = createRoot(document.getElementById('root')!);

const queryClient = new QueryClient();

const Root = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  );
};
root.render(<Root />);
