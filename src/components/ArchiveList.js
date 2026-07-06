'use client';

import { useState, useEffect, useCallback } from 'react';
import { useArchive } from '@/context/ArchiveContext';
import { getAllRecords, deleteRecord } from '@/lib/db';
import { downloadCSV } from '@/lib/csv';
import { getStatusColorClass } from '@/lib/calc';

// ponytail: single component for both mobile (cards) and desktop (table) views via CSS
export default function ArchiveList({ records, onEdit, refreshKey, onRefresh }) {
  const { archiveMode } = useArchive();
  const [confirmDelete, setConfirmDelete] = useState(null);

  // Refresh when archive mode turns on or refreshKey changes
  useEffect(() => {
    if (archiveMode && onRefresh) onRefresh();
  }, [archiveMode, refreshKey, onRefresh]);

  async function handleDelete(id) {
    await deleteRecord(id);
    setConfirmDelete(null);
    if (onRefresh) onRefresh();
  }

  if (!archiveMode) return null;

  if (!records || records.length === 0) {
    return (
      <div className="card mt-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-text-primary">Catatan Tersimpan</h2>
        </div>
        <p className="text-text-secondary text-sm text-center py-8">Belum ada data tersimpan.</p>
      </div>
    );
  }

  // Sort by most recent first
  const sorted = [...records].sort((a, b) => new Date(b.measurementDate || b.createdAt) - new Date(a.measurementDate || a.createdAt));

  return (
    <div className="card mt-6">
      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
        <h2 className="text-lg font-semibold text-text-primary">
          Catatan Tersimpan ({sorted.length})
        </h2>
        <button onClick={() => downloadCSV(sorted)} className="btn-secondary text-xs sm:text-sm">
          <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Unduh CSV
        </button>
      </div>

      {/* Mobile: card list */}
      <div className="sm:hidden space-y-2">
        {sorted.map(rec => (
          <div key={rec.id} className="bg-surface rounded-lg p-3 border border-border text-sm">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium text-text-primary">{rec.name || 'Tanpa Nama'}</p>
                <p className="text-xs text-text-secondary">
                  {rec.umurBulan != null ? `${rec.umurBulan} bln` : ''} · {rec.gender === 'L' ? 'L' : 'P'}
                </p>
              </div>
              <span className={`text-xs font-semibold ${getStatusColorClass(rec.statusKey || 'baik')}`}>
                {rec.status || '-'}
              </span>
            </div>
            <div className="flex gap-3 mt-1 text-xs text-text-secondary">
              <span>BB: {rec.weight} kg</span>
              <span>TB: {rec.height} cm</span>
            </div>
            <div className="flex gap-2 mt-2">
              <button onClick={() => onEdit(rec)} className="text-xs text-accent hover:underline">Edit</button>
              <button onClick={() => setConfirmDelete(rec.id)} className="text-xs text-danger hover:underline">Hapus</button>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop: table */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-text-secondary text-xs uppercase tracking-wider">
              <th className="text-left py-2 pr-2 font-medium">Nama</th>
              <th className="text-left py-2 pr-2 font-medium">JK</th>
              <th className="text-left py-2 pr-2 font-medium">Umur</th>
              <th className="text-right py-2 pr-2 font-medium">BB</th>
              <th className="text-right py-2 pr-2 font-medium">TB</th>
              <th className="text-left py-2 pr-2 font-medium">Status</th>
              <th className="text-right py-2 font-medium">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map(rec => (
              <tr key={rec.id} className="border-b border-border/50 hover:bg-surface/50">
                <td className="py-2 pr-2 text-text-primary font-medium">{rec.name || '-'}</td>
                <td className="py-2 pr-2 text-text-secondary">{rec.gender === 'L' ? 'L' : 'P'}</td>
                <td className="py-2 pr-2 text-text-secondary">{rec.umurBulan != null ? `${rec.umurBulan} bln` : '-'}</td>
                <td className="py-2 pr-2 text-right text-text-primary">{rec.weight}</td>
                <td className="py-2 pr-2 text-right text-text-primary">{rec.height}</td>
                <td className={`py-2 pr-2 text-xs font-semibold ${getStatusColorClass(rec.statusKey || 'baik')}`}>{rec.status || '-'}</td>
                <td className="py-2 text-right whitespace-nowrap">
                  <button onClick={() => onEdit(rec)} className="text-accent hover:underline text-xs mr-2">Edit</button>
                  <button onClick={() => setConfirmDelete(rec.id)} className="text-danger hover:underline text-xs">Hapus</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete confirmation modal */}
      {confirmDelete !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-surface-card rounded-xl p-6 m-4 max-w-sm w-full shadow-xl border border-border">
            <p className="text-text-primary font-medium mb-2">Hapus catatan?</p>
            <p className="text-sm text-text-secondary mb-4">Data yang dihapus tidak dapat dikembalikan.</p>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setConfirmDelete(null)} className="btn-secondary text-sm">Batal</button>
              <button onClick={() => handleDelete(confirmDelete)} className="btn-danger text-sm">Hapus</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
