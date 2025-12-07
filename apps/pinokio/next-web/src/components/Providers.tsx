'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type React from 'react';

export default function Providers({ children }: { children: React.ReactNode }) {
  return <QueryClientProvider client={new QueryClient()}>{children}</QueryClientProvider>;
}
