'use client';

import { useEffect, useRef } from 'react';

export default function ManualModal({ open, onClose, content }) {
  const dialogRef = useRef(null);

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}
      style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}>
      <div ref={dialogRef}
        className="rounded-2xl max-w-lg w-full max-h-[80vh] overflow-y-auto shadow-xl border"
        style={{ backgroundColor: 'var(--md-surface-container-high)', borderColor: 'var(--md-outline-variant)' }}
        onClick={e => e.stopPropagation()}
        role="dialog" aria-modal="true" aria-label="Panduan Data"
      >
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between px-5 py-3 border-b rounded-t-2xl"
          style={{ borderColor: 'var(--md-outline-variant)', backgroundColor: 'var(--md-surface-container-high)' }}>
          <h2 className="font-semibold" style={{ color: 'var(--md-on-surface)' }}>Panduan Data</h2>
          <button onClick={onClose}
            className="flex items-center justify-center w-8 h-8 rounded-full transition-colors"
            style={{ color: 'var(--md-on-surface-variant)' }}
            aria-label="Tutup">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="px-5 py-4 text-sm leading-relaxed space-y-3"
          style={{ color: 'var(--md-on-surface)' }}>
          {content ? (
            <div dangerouslySetInnerHTML={{ __html: content }} />
          ) : (
            <>
              <p className="font-semibold">Standar Antropometri Anak — Permenkes No. 2 Tahun 2020</p>
              <p style={{ color: 'var(--md-on-surface-variant)' }}>Penilaian status gizi anak usia 0–60 bulan menggunakan empat indeks:</p>
              <ul className="list-disc list-inside space-y-1" style={{ color: 'var(--md-on-surface-variant)' }}>
                <li><span className="font-medium" style={{ color: 'var(--md-on-surface)' }}>BB/U</span> — Berat Badan menurut Umur</li>
                <li><span className="font-medium" style={{ color: 'var(--md-on-surface)' }}>TB/U</span> — Tinggi Badan menurut Umur</li>
                <li><span className="font-medium" style={{ color: 'var(--md-on-surface)' }}>BB/TB</span> — Berat Badan menurut Tinggi Badan</li>
                <li><span className="font-medium" style={{ color: 'var(--md-on-surface)' }}>IMT/U</span> — Indeks Massa Tubuh menurut Umur</li>
              </ul>
              <p className="font-medium mt-3">Kategori Status Gizi (BB/TB &amp; IMT/U):</p>
              <ul className="list-disc list-inside space-y-1" style={{ color: 'var(--md-on-surface-variant)' }}>
                <li>Z &lt; -3 SD : Gizi Buruk</li>
                <li>-3 SD ≤ Z &lt; -2 SD : Gizi Kurang</li>
                <li>-2 SD ≤ Z ≤ +1 SD : Gizi Baik (Normal)</li>
                <li>+1 SD &lt; Z ≤ +2 SD : Berisiko Gizi Lebih</li>
                <li>+2 SD &lt; Z ≤ +3 SD : Gizi Lebih</li>
                <li>Z &gt; +3 SD : Obesitas</li>
              </ul>
              <p className="text-xs mt-3" style={{ color: 'var(--md-on-surface-variant)' }}>Untuk detail lengkap tabel Z-score per umur, lihat dokumen formula.md.</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
