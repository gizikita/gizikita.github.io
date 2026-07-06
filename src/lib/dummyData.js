// ponytail: dummy calculation for Fase 1 — replaces real Permenkes z-score logic in Phase 2
// Returns plausible-looking results based on inputs

// Defining categories per index (Permenkes No. 2 Tahun 2020)
// Each category: { key, label, minZ (inclusive), maxZ (exclusive), color }
// Order: from worst to best, then excess categories

const BBU_CATEGORIES = [
  { key: 'sangatKurang', label: 'Berat Badan Sangat Kurang', color: 'danger', minZ: -Infinity, maxZ: -3 },
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
  { key: 'buruk',     label: 'Gizi Buruk',          color: 'danger',  minZ: -Infinity, maxZ: -3 },
  { key: 'kurang',    label: 'Gizi Kurang',          color: 'warning', minZ: -3, maxZ: -2 },
  { key: 'baik',      label: 'Gizi Baik',            color: 'accent',  minZ: -2, maxZ: 1  },
  { key: 'risiko',    label: 'Berisiko Gizi Lebih',  color: 'warning', minZ: 1,  maxZ: 2  },
  { key: 'lebih',     label: 'Gizi Lebih',           color: 'warning', minZ: 2,  maxZ: 3  },
  { key: 'obesitas',  label: 'Obesitas',             color: 'danger',  minZ: 3,  maxZ: Infinity },
];

// IMT/U 0-60 bulan: same categories as BB/TB
const IMTU_CATEGORIES = BBTB_CATEGORIES;

function categorize(zscore, categories) {
  for (const cat of categories) {
    if (zscore >= cat.minZ && zscore < cat.maxZ) return cat;
  }
  return categories[categories.length - 1];
}

function dummyZScore(umurBulan, gender, bb, tb) {
  // BB/U: weight-for-age
  const bbMedian = gender === 'L' ? 7.5 + umurBulan * 0.35 : 7.0 + umurBulan * 0.32;
  const bbSd = 1.0 + umurBulan * 0.02;
  const zBbu = (bb - bbMedian) / bbSd;

  // TB/U: height-for-age
  const tbMedian = gender === 'L' ? 50 + umurBulan * 1.5 : 49 + umurBulan * 1.4;
  const tbSd = 2.0 + umurBulan * 0.05;
  const zTbu = (tb - tbMedian) / tbSd;

  // BB/TB: weight-for-height
  const bbTbMedian = tb * 0.035 + 2;
  const bbTbSd = 1.2;
  const zBbtb = (bb - bbTbMedian) / bbTbSd;

  // IMT/U: BMI-for-age
  const bmi = bb / ((tb / 100) ** 2);
  const bmiMedian = gender === 'L'
    ? 13 + umurBulan * 0.12 - (umurBulan ** 2) * 0.002
    : 12.5 + umurBulan * 0.13 - (umurBulan ** 2) * 0.0022;
  const bmiSd = 1.0 + umurBulan * 0.015;
  const zImtu = (bmi - bmiMedian) / bmiSd;

  return {
    bbu:  { zscore: parseFloat(zBbu.toFixed(2)) },
    tbu:  { zscore: parseFloat(zTbu.toFixed(2)) },
    bbtb: { zscore: parseFloat(zBbtb.toFixed(2)) },
    imtu: { zscore: parseFloat(zImtu.toFixed(2)) },
  };
}

const INDEX_META = {
  bbu:  { key: 'bbu',  label: 'BB/U', fullLabel: 'Berat Badan menurut Umur',         categories: BBU_CATEGORIES },
  tbu:  { key: 'tbu',  label: 'TB/U', fullLabel: 'Tinggi Badan menurut Umur',         categories: TBU_CATEGORIES },
  bbtb: { key: 'bbtb', label: 'BB/TB', fullLabel: 'Berat Badan menurut Tinggi Badan', categories: BBTB_CATEGORIES },
  imtu: { key: 'imtu', label: 'IMT/U', fullLabel: 'Indeks Massa Tubuh menurut Umur',  categories: IMTU_CATEGORIES },
};

export function hitungStatusGizi(umurBulan, gender, bb, tb) {
  const zs = dummyZScore(umurBulan, gender, bb, tb);

  const indices = {};
  for (const meta of Object.values(INDEX_META)) {
    const zVal = zs[meta.key].zscore;
    const status = categorize(zVal, meta.categories);
    indices[meta.key] = {
      zscore: zVal,
      status,
      ...meta,
    };
  }

  // Overall = BB/TB (primary indicator per Permenkes)
  const overall = indices.bbtb.status;

  return { zScores: zs, indices, status: overall };
}

export function getStatusColorClass(key) {
  const map = {
    sangatKurang: 'text-danger',
    kurang: 'text-warning',
    normal: 'text-accent',
    risikoLebih: 'text-warning',
    sangatPendek: 'text-danger',
    pendek: 'text-warning',
    tinggi: 'text-info',
    buruk: 'text-danger',
    baik: 'text-accent',
    risiko: 'text-warning',
    lebih: 'text-warning',
    obesitas: 'text-danger',
  };
  return map[key] || 'text-text-primary';
}
