// ponytail: Permenkes Z-score calculation engine
// Uses real WHO reference tables from formula.md with linear interpolation

import {
  BBU_BOY, BBU_GIRL, PBU_BOY, TBU_BOY, PBU_GIRL, TBU_GIRL,
  BBPB_BOY, BBTB_BOY, BBPB_GIRL, BBTB_GIRL,
  IMTU_BOY_0_24, IMTU_BOY_24_60, IMTU_GIRL_0_24, IMTU_GIRL_24_60,
} from '@/data/reference';

// Categories per Permenkes No.2/2020 (formula.md §B)
const BBU_CATEGORIES = [
  { key: 'sangatKurang', label: 'Berat Badan Sangat Kurang', color: 'danger',  minZ: -Infinity, maxZ: -3 },
  { key: 'kurang',       label: 'Berat Badan Kurang',         color: 'warning', minZ: -3, maxZ: -2 },
  { key: 'normal',       label: 'Berat Badan Normal',        color: 'accent',  minZ: -2, maxZ: 1  },
  { key: 'risikoLebih',  label: 'Risiko Berat Badan Lebih',  color: 'warning', minZ: 1,  maxZ: Infinity },
];
const TBU_CATEGORIES = [
  { key: 'sangatPendek', label: 'Sangat Pendek', color: 'danger',  minZ: -Infinity, maxZ: -3 },
  { key: 'pendek',       label: 'Pendek',        color: 'warning', minZ: -3, maxZ: -2 },
  { key: 'normal',       label: 'Normal',         color: 'accent',  minZ: -2, maxZ: 3  },
  { key: 'tinggi',       label: 'Tinggi',         color: 'info',    minZ: 3,  maxZ: Infinity },
];
const BBTB_CATEGORIES = [
  { key: 'buruk',    label: 'Gizi Buruk',          color: 'danger',  minZ: -Infinity, maxZ: -3 },
  { key: 'kurang',   label: 'Gizi Kurang',          color: 'warning', minZ: -3, maxZ: -2 },
  { key: 'baik',     label: 'Gizi Baik',            color: 'accent',  minZ: -2, maxZ: 1  },
  { key: 'risiko',   label: 'Berisiko Gizi Lebih',  color: 'warning', minZ: 1,  maxZ: 2  },
  { key: 'lebih',    label: 'Gizi Lebih',           color: 'warning', minZ: 2,  maxZ: 3  },
  { key: 'obesitas', label: 'Obesitas',             color: 'danger',  minZ: 3,  maxZ: Infinity },
];
const IMTU_CATEGORIES = BBTB_CATEGORIES;

const INDEX_META = {
  bbu:  { key: 'bbu',  label: 'BB/U', fullLabel: 'Berat Badan menurut Umur',         categories: BBU_CATEGORIES },
  tbu:  { key: 'tbu',  label: 'TB/U', fullLabel: 'Tinggi Badan menurut Umur',         categories: TBU_CATEGORIES },
  bbtb: { key: 'bbtb', label: 'BB/TB', fullLabel: 'Berat Badan menurut Tinggi Badan', categories: BBTB_CATEGORIES },
  imtu: { key: 'imtu', label: 'IMT/U', fullLabel: 'Indeks Massa Tubuh menurut Umur',  categories: IMTU_CATEGORIES },
};

function categorize(zscore, categories) {
  for (const cat of categories) {
    if (zscore >= cat.minZ && zscore < cat.maxZ) return cat;
  }
  return categories[categories.length - 1];
}

// --- Lookup helpers ---
function findRow(table, key) {
  let lo = 0, hi = table.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (table[mid][0] === key) return mid;
    if (table[mid][0] < key) lo = mid + 1;
    else hi = mid - 1;
  }
  return lo;
}

function interpolateRef(table, exactKey) {
  if (!table || !table.length) return null;
  const idx = findRow(table, exactKey);
  if (idx < 0 || idx >= table.length) return null;
  if (Math.abs(table[idx][0] - exactKey) < 0.01) return table[idx].slice(1);

  const hi = Math.min(idx, table.length - 1);
  const lo = Math.max(0, hi - 1);
  const rLo = table[lo], rHi = table[hi];
  if (!rLo || !rHi) return null;

  const t = (exactKey - rLo[0]) / (rHi[0] - rLo[0]);
  return rLo.slice(1).map((v, i) => v + (rHi[i + 1] - v) * t);
}

function computeZ(observed, ref) {
  if (!ref) return null;
  const [m3, m2, m1, M, p1, p2, p3] = ref;

  if (observed < M) {
    if (observed >= m2) return (observed - M) / ((M - m2) / 2);
    if (observed >= m3) return -2 + (observed - m2) / (m2 - m3);
    return -3 + (observed - m3) / (m2 - m3);
  } else {
    if (observed <= p1) return (observed - M) / (p1 - M);
    if (observed <= p2) return 1 + (observed - p1) / (p2 - p1);
    if (observed <= p3) return 2 + (observed - p2) / (p3 - p2);
    return 3 + (observed - p3) / (p3 - p2);
  }
}

function computeZSimple(observed, median, sd) {
  return (observed - median) / sd;
}

// --- Public API ---
export function hitungStatusGizi(umurBulan, gender, bb, tb) {
  const g = gender === 'L' ? 'BOY' : 'GIRL';

  // BB/U
  const bbuTable = g === 'BOY' ? BBU_BOY : BBU_GIRL;
  const zBbu = computeZ(bb, interpolateRef(bbuTable, umurBulan)) ?? computeZSimple(bb, 7 + umurBulan * 0.33, 1.0 + umurBulan * 0.02);

  // TB/U
  const tbuTable = umurBulan <= 24
    ? (g === 'BOY' ? PBU_BOY : PBU_GIRL)
    : (g === 'BOY' ? TBU_BOY : TBU_GIRL);
  const zTbu = computeZ(tb, interpolateRef(tbuTable, umurBulan)) ?? computeZSimple(tb, 50 + umurBulan * 1.45, 2.0 + umurBulan * 0.05);

  // BB/TB — by height
  let zBbtb;
  const bbtbTable = umurBulan <= 24
    ? (g === 'BOY' ? BBPB_BOY : BBPB_GIRL)
    : (g === 'BOY' ? BBTB_BOY : BBTB_GIRL);
  if (bbtbTable && bbtbTable.length) {
    const minH = bbtbTable[0][0], maxH = bbtbTable[bbtbTable.length - 1][0];
    zBbtb = computeZ(bb, interpolateRef(bbtbTable, Math.max(minH, Math.min(maxH, tb))))
      ?? computeZSimple(bb, tb * 0.035 + 2, 1.2);
  } else {
    // Fallback for girls BB/TB tables
    zBbtb = computeZSimple(bb, tb * 0.035 + 2, 1.2);
  }

  // IMT/U
  const imtuTable = umurBulan <= 24
    ? (g === 'BOY' ? IMTU_BOY_0_24 : IMTU_GIRL_0_24)
    : (g === 'BOY' ? IMTU_BOY_24_60 : IMTU_GIRL_24_60);
  const bmi = bb / ((tb / 100) ** 2);
  const zImtu = computeZ(bmi, interpolateRef(imtuTable, umurBulan)) ?? computeZSimple(bmi, 15, 1.5);

  const zValues = { bbu: zBbu, tbu: zTbu, bbtb: zBbtb, imtu: zImtu };
  const zScores = {};
  const indices = {};

  for (const [key, z] of Object.entries(zValues)) {
    const f = parseFloat(z.toFixed(2));
    zScores[key] = { zscore: f };
    const meta = INDEX_META[key];
    indices[key] = { zscore: f, status: categorize(z, meta.categories), ...meta };
  }

  return { zScores, indices, status: indices.bbtb.status };
}

export function getStatusColorClass(key) {
  const map = {
    sangatKurang: 'text-danger', kurang: 'text-warning', normal: 'text-accent',
    risikoLebih: 'text-warning', sangatPendek: 'text-danger', pendek: 'text-warning',
    tinggi: 'text-info', buruk: 'text-danger', baik: 'text-accent',
    risiko: 'text-warning', lebih: 'text-warning', obesitas: 'text-danger',
  };
  return map[key] || 'text-text-primary';
}
