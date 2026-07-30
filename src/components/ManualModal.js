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
        className="rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-xl border"
        style={{ backgroundColor: 'var(--md-surface-container-high)', borderColor: 'var(--md-outline-variant)' }}
        onClick={e => e.stopPropagation()}
        role="dialog" aria-modal="true" aria-label="Panduan Data"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b shrink-0"
          style={{ borderColor: 'var(--md-outline-variant)', backgroundColor: 'var(--md-surface-container-high)' }}>
          <h2 className="font-semibold" style={{ color: 'var(--md-on-surface)' }}>Panduan Data</h2>
          <div className="flex items-center gap-2">
            {/* Download button in header */}
            <a href="/GiziKita_Panduan_Operasional.pdf" download
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors whitespace-nowrap"
              style={{
                backgroundColor: 'var(--md-primary)',
                color: 'var(--md-on-primary)',
                borderColor: 'var(--md-primary)',
              }}>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download PDF
            </a>
            <button onClick={onClose}
              className="flex items-center justify-center w-8 h-8 rounded-full transition-colors"
              style={{ color: 'var(--md-on-surface-variant)' }}
              aria-label="Tutup">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Tab bar */}
        <div className="flex border-b shrink-0" style={{ borderColor: 'var(--md-outline-variant)' }}>
          <div className="px-5 py-2.5 text-sm font-medium border-b-2" style={{ borderColor: 'var(--md-primary)', color: 'var(--md-on-surface)' }}>
            Panduan Operasional
          </div>
        </div>

        {/* Content — embed PDF for preview */}
        <div className="flex-1 min-h-0">
          <embed
            src="/GiziKita_Panduan_Operasional.pdf"
            type="application/pdf"
            className="w-full h-full"
            style={{ minHeight: '60vh' }}
          />
        </div>

        {/* Bottom bar */}
        <div className="flex items-center justify-between px-5 py-3 border-t shrink-0"
          style={{ borderColor: 'var(--md-outline-variant)', backgroundColor: 'var(--md-surface-container)' }}>
          <p className="text-xs" style={{ color: 'var(--md-on-surface-variant)' }}>
            Panduan Operasional GiziKita — 16 halaman
          </p>
          <a href="/GiziKita_Panduan_Operasional.pdf" download
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors"
            style={{
              backgroundColor: 'var(--md-primary)',
              color: 'var(--md-on-primary)',
              borderColor: 'var(--md-primary)',
            }}>
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Download PDF
          </a>
        </div>
      </div>
    </div>
  );
}
