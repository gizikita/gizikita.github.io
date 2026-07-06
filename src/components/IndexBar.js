'use client';

const INDEX_OPTIONS = [
  { key: 'ringkasan', label: 'Ringkasan' },
  { key: 'bbu', label: 'BB/U' },
  { key: 'tbu', label: 'TB/U' },
  { key: 'bbtb', label: 'BB/TB' },
  { key: 'imtu', label: 'IMT/U' },
];

export default function IndexBar({ selectedIndex, onSelectIndex }) {
  return (
    <div className="flex flex-wrap gap-1 px-4 py-3 mx-auto w-full"
      style={{ maxWidth: 'var(--content-max-width, 960px)' }}>
      <div className="inline-flex flex-wrap rounded-xl border p-0.5"
        style={{
          borderColor: 'var(--md-outline-variant)',
          backgroundColor: 'var(--md-surface-container)',
        }}>
        {INDEX_OPTIONS.map(opt => {
          const active = selectedIndex === opt.key;
          return (
            <button key={opt.key} onClick={() => onSelectIndex(opt.key)}
              className="px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap"
              style={{
                backgroundColor: active ? 'var(--md-primary)' : 'transparent',
                color: active ? 'var(--md-on-primary)' : 'var(--md-on-surface-variant)',
              }}>
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
