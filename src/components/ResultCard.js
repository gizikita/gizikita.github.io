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
      <div className="card mt-4">
        <div className="text-center mb-4 pb-3 border-b border-border">
          <p className="text-xs text-text-secondary uppercase tracking-wider mb-1">{idx.fullLabel}</p>
          <p className="text-3xl sm:text-4xl font-bold text-text-primary">{idx.label}</p>
        </div>

        <div className="text-center mb-4">
          <p className="text-sm text-text-secondary mb-1">Status</p>
          <p className={`text-2xl sm:text-3xl font-bold ${getStatusColorClass(idx.status.key)}`}>
            {idx.status.label}
          </p>
        </div>

        <div className="bg-surface rounded-lg p-4 text-center border border-border">
          <p className="text-xs text-text-secondary uppercase tracking-wider mb-1">Z-Score</p>
          <p className="text-xl sm:text-2xl font-mono font-bold text-text-primary">
            {idx.zscore > 0 ? '+' : ''}{idx.zscore} SD
          </p>
        </div>
      </div>
    );
  }

  // Ringkasan: show all 4 indices
  const indexList = [indices.bbu, indices.tbu, indices.bbtb, indices.imtu];

  return (
    <div className="card mt-4">
      {/* Overall status (BB/TB) */}
      <div className="text-center mb-4 pb-3 border-b border-border">
        <p className="text-xs text-text-secondary uppercase tracking-wider mb-1">Status Gizi Utama (BB/TB)</p>
        <p className={`text-2xl sm:text-3xl font-bold ${getStatusColorClass(status.key)}`}>
          {status.label}
        </p>
      </div>

      {/* Per-index grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {indexList.map(idx => (
          <div key={idx.key} className="bg-surface rounded-lg p-3 border border-border">
            <div className="flex items-baseline justify-between mb-1">
              <p className="text-sm font-semibold text-text-primary">{idx.label}</p>
              <p className="text-xs text-text-secondary">{idx.fullLabel}</p>
            </div>
            <div className="flex items-center justify-between">
              <p className={`text-base font-bold ${getStatusColorClass(idx.status.key)}`}>
                {idx.status.label}
              </p>
              <p className="text-sm text-text-secondary font-mono">
                Z: {idx.zscore > 0 ? '+' : ''}{idx.zscore}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
