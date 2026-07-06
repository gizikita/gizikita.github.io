'use client';

import { useTheme } from '@/context/ThemeContext';
import { useArchive } from '@/context/ArchiveContext';

export default function TopBar({ onOpenManual }) {
  const { theme, toggleTheme } = useTheme();
  const { archiveMode, toggleArchive } = useArchive();

  return (
    <header className="sticky top-0 z-40 bg-surface-card border-b border-border">
      <div className="mx-auto max-w-content flex items-center justify-between h-14 px-4 gap-2">
        {/* Left: brand */}
        <div className="flex items-center gap-2 shrink-0">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
            style={{ color: 'var(--md-primary)' }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          <span className="font-semibold text-base hidden sm:inline"
            style={{ color: 'var(--md-on-surface)' }}>GiziKita</span>
          <span className="font-semibold text-base sm:hidden"
            style={{ color: 'var(--md-on-surface)' }}>GK</span>
        </div>

        {/* Right: actions */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Panduan Data */}
          <button onClick={onOpenManual}
            className="flex items-center gap-1 px-2 py-1.5 rounded-full text-xs font-medium border transition-colors whitespace-nowrap"
            style={{
              backgroundColor: 'transparent',
              color: 'var(--md-on-surface-variant)',
              borderColor: 'var(--md-outline-variant)',
            }}
            title="Panduan Data">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
            </svg>
            <span className="hidden sm:inline">Panduan</span>
          </button>

          {/* Archive Toggle — MD3 filter chip */}
          <button
            onClick={toggleArchive}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium transition-colors whitespace-nowrap border"
            style={{
              backgroundColor: archiveMode ? 'var(--md-secondary-container)' : 'transparent',
              color: archiveMode ? 'var(--md-on-secondary-container)' : 'var(--md-on-surface-variant)',
              borderColor: archiveMode ? 'var(--md-secondary-container)' : 'var(--md-outline-variant)',
            }}
            aria-label={archiveMode ? 'Nonaktifkan mode arsip' : 'Aktifkan mode arsip'}
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>
            <span>Arsip</span>
          </button>

          {/* Theme Toggle */}
          <button onClick={toggleTheme}
            className="flex items-center justify-center w-8 h-8 rounded-full border transition-colors"
            style={{
              backgroundColor: 'transparent',
              color: 'var(--md-on-surface-variant)',
              borderColor: 'var(--md-outline-variant)',
            }}
            title={theme === 'light' ? 'Mode Gelap' : 'Mode Terang'}
          >
            {theme === 'light' ? (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
