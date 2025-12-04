import './global.css';

import { Analytics } from '@vercel/analytics/next';

export default function Layout({ children }: React.PropsWithChildren) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.svg" />
      </head>
      <body className="flex min-h-svh flex-col font-sans antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
