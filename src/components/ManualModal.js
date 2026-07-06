'use client';

import { useEffect } from 'react';

// ponytail: simple modal overlay — no portal library needed, fixed positioning works
export default function ManualModal({ open, onClose, content }) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div
        className="bg-surface-card rounded-xl max-w-lg w-full max-h-[80vh] overflow-y-auto shadow-xl border border-border"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-border sticky top-0 bg-surface-card">
          <h2 className="font-semibold text-text-primary">Panduan Data</h2>
          <button onClick={onClose} className="btn-secondary !px-2 !py-1 text-sm" aria-label="Tutup">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="px-5 py-4 text-sm text-text-primary leading-relaxed space-y-3">
          {content ? (
            <div dangerouslySetInnerHTML={{ __html: content }} />
          ) : (
            <>
              <p><strong>Standar Antropometri Anak — Permenkes No. 2 Tahun 2020</strong></p>
              <p>Penilaian status gizi anak usia 0–60 bulan menggunakan tiga indeks utama:</p>
              <ul className="list-disc list-inside space-y-1">
                <li><strong>BB/U</strong> — Berat Badan menurut Umur</li>
                <li><strong>TB/U</strong> — Tinggi Badan menurut Umur</li>
                <li><strong>BB/TB</strong> — Berat Badan menurut Tinggi Badan</li>
              </ul>
              <p className="font-medium mt-3">Kategori Status Gizi (BB/TB):</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Z &lt; -3 SD : Gizi Buruk</li>
                <li>-3 SD ≤ Z &lt; -2 SD : Gizi Kurang</li>
                <li>-2 SD ≤ Z ≤ +2 SD : Gizi Baik (Normal)</li>
                <li>+2 SD &lt; Z ≤ +3 SD : Gizi Lebih</li>
                <li>Z &gt; +3 SD : Obesitas</li>
              </ul>
              <p className="text-xs text-text-secondary mt-3">Untuk detail lengkap tabel Z-score per umur, lihat dokumen formula.md.</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
