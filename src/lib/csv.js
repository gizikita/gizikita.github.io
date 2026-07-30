// ponytail: papaparse for CSV — no manual string-building needed
import Papa from 'papaparse';
import { hitungStatusGizi } from './calc';

function computeAllStatus(r) {
  // If explicit per-index statuses are provided, use them directly (for template)
  if (r._bbu !== undefined || r._tbu !== undefined || r._bbtb !== undefined || r._imtu !== undefined) {
    return { bbu: r._bbu || '', tbu: r._tbu || '', bbtb: r._bbtb || '', imtu: r._imtu || '' };
  }

  const hasWeight = r.weight != null && r.weight !== '';
  const hasHeight = r.height != null && r.height !== '';
  const umurBulan = r.umurBulan != null ? r.umurBulan
    : r.birthDate ? Math.round((new Date() - new Date(r.birthDate)) / (1000 * 60 * 60 * 24 * 30.44)) : null;

  if (!umurBulan || umurBulan < 0 || umurBulan > 60 || (!hasWeight && !hasHeight)) {
    return { bbu: '', tbu: '', bbtb: '', imtu: '' };
  }

  const gender = r.gender || 'L';
  const bb = hasWeight ? Number(r.weight) : 3;
  const tb = hasHeight ? Number(r.height) : 50;
  const full = hitungStatusGizi(umurBulan, gender, bb, tb);

  return {
    bbu: hasWeight ? full.indices.bbu.status.label : '',
    tbu: hasHeight ? full.indices.tbu.status.label : '',
    bbtb: (hasWeight && hasHeight) ? full.indices.bbtb.status.label : '',
    imtu: (hasWeight && hasHeight) ? full.indices.imtu.status.label : '',
  };
}

export function downloadCSV(records, filename = 'gizikita-data.csv') {
  const data = records.map(r => {
    const all = computeAllStatus(r);
    return {
      Nama: r.name ? r.name.toUpperCase() : '',
      JK: r.gender === 'L' ? 'L' : 'P',
      'Tgl Lahir': r.birthDate || '',
      'Tgl Ukur': r.measurementDate || '',
      'BB (kg)': r.weight != null ? String(r.weight) : '',
      'TB (cm)': r.height != null ? String(r.height) : '',
      'Status BB/U': all.bbu,
      'Status TB/U': all.tbu,
      'Status BB/TB': all.bbtb,
      'Status IMT/U': all.imtu,
      'Nama Orang Tua': r.parentName || '',
      Alamat: r.address || '',
    };
  });

  const csv = Papa.unparse(data);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
