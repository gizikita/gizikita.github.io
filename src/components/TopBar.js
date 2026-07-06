'use client';

import { useTheme } from '@/context/ThemeContext';
import { useArchive } from '@/context/ArchiveContext';

const INDEX_OPTIONS = [
  { key: 'ringkasan', label: 'Ringkasan', short: 'All' },
  { key: 'bbu', label: 'BB/U', short: 'BB/U' },
  { key: 'tbu', label: 'TB/U', short: 'TB/U' },
  { key: 'bbtb', label: 'BB/TB', short: 'BB/TB' },
  { key: 'imtu', label: 'IMT/U', short: 'IMT/U' },
];

export default function TopBar({ onOpenManual, selectedIndex, onSelectIndex }) {
  const { theme, toggleTheme } = useTheme();
  const { archiveMode, toggleArchive } = useArchive();

  return (
    <header className="sticky top-0 z-40 bg-surface-card/80 backdrop-blur-md border-b border-border">
      <div className="mx-auto max-w-content flex items-center justify-between h-14 px-4 gap-2">
        {/* Left: brand */}
        <div className="flex items-center gap-2 shrink-0">
          <svg className="w-6 h-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          <span className="font-semibold text-base text-text-primary hidden sm:inline">StatusGiziKu</span>
          <span className="font-semibold text-base text-text-primary sm:hidden">SG</span>
        </div>

        {/* Center: index mode pills */}
        <div className="flex items-center gap-0.5 sm:gap-1 overflow-x-auto no-scrollbar">
          {INDEX_OPTIONS.map(opt => (
            <button
              key={opt.key}
              onClick={() => onSelectIndex(opt.key)}
              className={`px-2 py-1 rounded-md text-xs font-medium transition-colors whitespace-nowrap
                ${selectedIndex === opt.key
                  ? 'bg-accent text-white'
                  : 'text-text-secondary hover:bg-surface hover:text-text-primary'
                }`}
            >
              <span className="sm:hidden">{opt.short}</span>
              <span className="hidden sm:inline">{opt.label}</span>
            </button>
          ))}
        </div>

        {/* Right: actions */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Panduan Data */}
          <button
            onClick={onOpenManual}
            className="btn-secondary !px-2 !py-1.5 text-xs sm:text-sm sm:!px-3"
            title="Panduan Data"
          >
            <svg className="w-4 h-4 sm:mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
            </svg>
            <span className="hidden sm:inline">Panduan</span>
          </button>

          {/* Archive Toggle */}
          <label className="flex items-center gap-1.5 cursor-pointer select-none text-xs sm:text-sm" title="Mode Arsip">
            <span className="text-text-secondary hidden sm:inline">Arsip</span>
            <div className={`relative w-10 h-5 rounded-full transition-colors duration-200 ${archiveMode ? 'bg-accent' : 'bg-gray-300 dark:bg-slate-600'}`}>
              <div className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${archiveMode ? 'translate-x-5' : ''}`} />
            </div>
            <input type="checkbox" checked={archiveMode} onChange={toggleArchive} className="sr-only" aria-label="Aktifkan mode arsip" />
          </label>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="btn-secondary !px-2 !py-1.5 text-sm"
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
