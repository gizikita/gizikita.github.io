'use client';

import { useEffect } from 'react';
import './globals.css';

export default function RootLayout({ children }) {
  // Register service worker for offline support
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {
        // SW registration is best-effort in Phase 1
      });
    }
  }, []);

  return (
    <html lang="id" data-theme="light" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#006B5C" />
        <meta name="description" content="Kalkulator status gizi balita dan anak 0–60 bulan berdasarkan standar Permenkes" />
        <link rel="manifest" href="/manifest.json" />
        <title>GiziKita</title>
      </head>
      <body className="min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}
