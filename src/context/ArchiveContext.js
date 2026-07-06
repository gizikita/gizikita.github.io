'use client';

import { createContext, useContext, useState, useCallback } from 'react';

const ArchiveContext = createContext(null);

export function ArchiveProvider({ children }) {
  const [archiveMode, setArchiveMode] = useState(false);

  const toggleArchive = useCallback(() => {
    setArchiveMode(prev => !prev);
  }, []);

  return (
    <ArchiveContext.Provider value={{ archiveMode, toggleArchive }}>
      {children}
    </ArchiveContext.Provider>
  );
}

export function useArchive() {
  const ctx = useContext(ArchiveContext);
  if (!ctx) throw new Error('useArchive must be used within ArchiveProvider');
  return ctx;
}
