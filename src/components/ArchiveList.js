'use client';

import { useState, useEffect } from 'react';
import { useArchive } from '@/context/ArchiveContext';
import { getAllRecords, deleteRecord } from '@/lib/db';
import { downloadCSV } from '@/lib/csv';
import { getStatusColorClass } from '@/lib/calc';

export default function ArchiveList({ records, onEdit, refreshKey, onRefresh }) {
  const { archiveMode } = useArchive();
  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => {
    if (archiveMode && onRefresh) onRefresh();
  }, [archiveMode, refreshKey, onRefresh]);

  async function handleDelete(id) {
    await deleteRecord(id);
    setConfirmDelete(null);
    if (onRefresh) onRefresh();
  }

  if (!archiveMode) return null;

  const containerStyle = {
    borderColor: 'var(--md-outline-variant)',
    backgroundColor: 'var(--md-surface-card)',
  };

  if (!records || records.length === 0) {
    return (
      <div className="mt-6 rounded-xl border p-5" style={containerStyle}>
        <h2 className="text-lg font-semibold mb-3" style={{ color: 'var(--md-on-surface)' }}>Catatan Tersimpan</h2>
        <p className="text-sm text-center py-8" style={{ color: 'var(--md-on-surface-variant)' }}>Belum ada data tersimpan.</p>
      </div>
    );
  }

  const sorted = [...records].sort((a, b) => new Date(b.measurementDate || b.createdAt) - new Date(a.measurementDate || a.createdAt));

  return (
    <div className="mt-6 rounded-xl border p-5" style={containerStyle}>
      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
        <h2 className="text-lg font-semibold" style={{ color: 'var(--md-on-surface)' }}>Catatan Tersimpan ({sorted.length})</h2>
        <button onClick={() => downloadCSV(sorted)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors whitespace-nowrap"
          style={{
            backgroundColor: 'transparent',
            color: 'var(--md-on-surface-variant)',
            borderColor: 'var(--md-outline-variant)',
          }}>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Unduh CSV
        </button>
      </div>

      {/* Mobile: cards */}
      <div className="sm:hidden space-y-2">
        {sorted.map(rec => (
          <div key={rec.id} className="rounded-xl p-3 border text-sm" style={{ backgroundColor: 'var(--md-surface)', borderColor: 'var(--md-outline-variant)' }}>
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium" style={{ color: 'var(--md-on-surface)' }}>{rec.name || 'Tanpa Nama'}</p>
                <p className="text-xs" style={{ color: 'var(--md-on-surface-variant)' }}>
                  {rec.umurBulan != null ? `${rec.umurBulan} bln` : ''} · {rec.gender === 'L' ? 'L' : 'P'}
                </p>
              </div>
              <span className={`text-xs font-semibold ${getStatusColorClass(rec.statusKey || 'baik')}`}>{rec.status || '-'}</span>
            </div>
            <div className="flex gap-3 mt-1 text-xs" style={{ color: 'var(--md-on-surface-variant)' }}>
              <span>BB: {rec.weight} kg</span>
              <span>TB: {rec.height} cm</span>
            </div>
            <div className="flex gap-2 mt-2">
              <button onClick={() => onEdit(rec)} className="text-xs font-medium transition-colors"
                style={{ color: 'var(--md-primary)' }}>Edit</button>
              <button onClick={() => setConfirmDelete(rec.id)} className="text-xs font-medium transition-colors"
                style={{ color: 'var(--md-error)' }}>Hapus</button>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop: table */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b" style={{ borderColor: 'var(--md-outline-variant)', color: 'var(--md-on-surface-variant)' }}>
              <th className="text-left py-2 pr-2 font-medium text-xs uppercase tracking-wider">Nama</th>
              <th className="text-left py-2 pr-2 font-medium text-xs uppercase tracking-wider">JK</th>
              <th className="text-left py-2 pr-2 font-medium text-xs uppercase tracking-wider">Umur</th>
              <th className="text-right py-2 pr-2 font-medium text-xs uppercase tracking-wider">BB</th>
              <th className="text-right py-2 pr-2 font-medium text-xs uppercase tracking-wider">TB</th>
              <th className="text-left py-2 pr-2 font-medium text-xs uppercase tracking-wider">Status</th>
              <th className="text-right py-2 font-medium text-xs uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map(rec => (
              <tr key={rec.id} className="border-b" style={{ borderColor: 'var(--md-outline-variant)', borderWidth: '0.5px' }}>
                <td className="py-2 pr-2 font-medium" style={{ color: 'var(--md-on-surface)' }}>{rec.name || '-'}</td>
                <td className="py-2 pr-2" style={{ color: 'var(--md-on-surface-variant)' }}>{rec.gender === 'L' ? 'L' : 'P'}</td>
                <td className="py-2 pr-2" style={{ color: 'var(--md-on-surface-variant)' }}>{rec.umurBulan != null ? `${rec.umurBulan} bln` : '-'}</td>
                <td className="py-2 pr-2 text-right" style={{ color: 'var(--md-on-surface)' }}>{rec.weight}</td>
                <td className="py-2 pr-2 text-right" style={{ color: 'var(--md-on-surface)' }}>{rec.height}</td>
                <td className={`py-2 pr-2 text-xs font-semibold ${getStatusColorClass(rec.statusKey || 'baik')}`}>{rec.status || '-'}</td>
                <td className="py-2 text-right whitespace-nowrap">
                  <button onClick={() => onEdit(rec)} className="text-xs font-medium mr-2 transition-colors"
                    style={{ color: 'var(--md-primary)' }}>Edit</button>
                  <button onClick={() => setConfirmDelete(rec.id)} className="text-xs font-medium transition-colors"
                    style={{ color: 'var(--md-error)' }}>Hapus</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete confirmation — MD3 dialog */}
      {confirmDelete !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}>
          <div className="rounded-2xl p-6 max-w-sm w-full shadow-xl border"
            style={{ backgroundColor: 'var(--md-surface-container-high)', borderColor: 'var(--md-outline-variant)' }}>
            <p className="font-medium mb-2" style={{ color: 'var(--md-on-surface)' }}>Hapus catatan?</p>
            <p className="text-sm mb-5" style={{ color: 'var(--md-on-surface-variant)' }}>Data yang dihapus tidak dapat dikembalikan.</p>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setConfirmDelete(null)}
                className="px-4 py-2 rounded-xl text-sm font-medium transition-colors"
                style={{ backgroundColor: 'var(--md-surface-container)', color: 'var(--md-on-surface)' }}>Batal</button>
              <button onClick={() => handleDelete(confirmDelete)}
                className="px-4 py-2 rounded-xl text-sm font-medium transition-colors"
                style={{ backgroundColor: 'var(--md-error)', color: 'var(--md-on-error)' }}>Hapus</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
