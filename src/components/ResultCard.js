'use client';

import { getStatusColorClass } from '@/lib/calc';

export default function ResultCard({ result, selectedIndex }) {
  if (!result) return null;

  const { indices, status } = result;

  // Single index detail view
  if (selectedIndex !== 'ringkasan') {
    const idx = indices[selectedIndex];
    if (!idx) return null;

    return (
      <div className="mt-4 rounded-xl border p-5" style={{ borderColor: 'var(--md-outline-variant)', backgroundColor: 'var(--md-surface-card)' }}>
        <div className="text-center mb-4 pb-4" style={{ borderBottom: '1px solid var(--md-outline-variant)' }}>
          <p className="text-xs uppercase tracking-wider mb-1" style={{ color: 'var(--md-on-surface-variant)' }}>{idx.fullLabel}</p>
          <p className="text-3xl sm:text-4xl font-bold" style={{ color: 'var(--md-on-surface)' }}>{idx.label}</p>
        </div>
        <div className="text-center mb-4">
          <p className="text-sm mb-1" style={{ color: 'var(--md-on-surface-variant)' }}>Status</p>
          <p className={`text-2xl sm:text-3xl font-bold ${getStatusColorClass(idx.status.key)}`}>{idx.status.label}</p>
        </div>
        <div className="rounded-xl p-4 text-center border" style={{ backgroundColor: 'var(--md-surface)', borderColor: 'var(--md-outline-variant)' }}>
          <p className="text-xs uppercase tracking-wider mb-1" style={{ color: 'var(--md-on-surface-variant)' }}>Z-Score</p>
          <p className="text-xl sm:text-2xl font-mono font-bold" style={{ color: 'var(--md-on-surface)' }}>
            {idx.zscore > 0 ? '+' : ''}{idx.zscore} SD
          </p>
        </div>
      </div>
    );
  }

  // Ringkasan
  const indexList = [indices.bbu, indices.tbu, indices.bbtb, indices.imtu];

  return (
    <div className="mt-4 rounded-xl border p-5" style={{ borderColor: 'var(--md-outline-variant)', backgroundColor: 'var(--md-surface-card)' }}>
      {/* Overall status */}
      <div className="text-center mb-4 pb-4" style={{ borderBottom: '1px solid var(--md-outline-variant)' }}>
        <p className="text-xs uppercase tracking-wider mb-1" style={{ color: 'var(--md-on-surface-variant)' }}>Status Gizi Utama (BB/TB)</p>
        <p className={`text-2xl sm:text-3xl font-bold ${getStatusColorClass(status.key)}`}>{status.label}</p>
      </div>

      {/* Per-index grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {indexList.map(idx => (
          <div key={idx.key} className="rounded-xl p-3 border" style={{ backgroundColor: 'var(--md-surface)', borderColor: 'var(--md-outline-variant)' }}>
            <div className="flex items-baseline justify-between mb-1">
              <p className="text-sm font-semibold" style={{ color: 'var(--md-on-surface)' }}>{idx.label}</p>
              <p className="text-xs" style={{ color: 'var(--md-on-surface-variant)' }}>{idx.fullLabel}</p>
            </div>
            <div className="flex items-center justify-between">
              <p className={`text-base font-bold ${getStatusColorClass(idx.status.key)}`}>{idx.status.label}</p>
              <p className="text-sm font-mono" style={{ color: 'var(--md-on-surface-variant)' }}>Z: {idx.zscore > 0 ? '+' : ''}{idx.zscore}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
