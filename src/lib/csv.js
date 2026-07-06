// ponytail: papaparse for CSV — no manual string-building needed
import Papa from 'papaparse';

export function downloadCSV(records, filename = 'status-gizi-data.csv') {
  const data = records.map(r => ({
    Nama: r.name || '',
    JK: r.gender === 'L' ? 'Laki-laki' : 'Perempuan',
    'Tgl Lahir': r.birthDate || '',
    'Tgl Ukur': r.measurementDate || '',
    'BB (kg)': r.weight != null ? String(r.weight) : '',
    'TB (cm)': r.height != null ? String(r.height) : '',
    Status: r.status || '',
    'Nama Orang Tua': r.parentName || '',
    Alamat: r.address || '',
  }));

  const csv = Papa.unparse(data);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
