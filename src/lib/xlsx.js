// ponytail: minimal xlsx parser — no dependencies, uses native ZIP parsing + DOMParser
// Handles the common case: shared strings + sheet1.xml in standard xlsx files
// Known ceiling: doesn't handle all ZIP features (encryption, ZIP64, data descriptors)

// --- ZIP local file header parser ---
function readUint16(view, offset) {
  return view.getUint16(offset, true);
}
function readUint32(view, offset) {
  return view.getUint32(offset, true);
}

const LOCAL_HEADER_SIG = 0x04034b50;
const CENTRAL_SIG = 0x02014b50;

function findLocalEntries(buffer) {
  const view = new DataView(buffer);
  const entries = [];
  let offset = 0;

  while (offset < buffer.byteLength - 30) {
    if (readUint32(view, offset) !== LOCAL_HEADER_SIG) { offset++; continue; }
    const compression = readUint16(view, offset + 8);
    const compSize = readUint32(view, offset + 18);
    const uncompSize = readUint32(view, offset + 22);
    const nameLen = readUint16(view, offset + 26);
    const extraLen = readUint16(view, offset + 28);
    const nameOffset = offset + 30;
    const name = buffer.slice(nameOffset, nameOffset + nameLen);
    const nameStr = new TextDecoder().decode(name);
    const dataOffset = nameOffset + nameLen + extraLen;
    const compressed = buffer.slice(dataOffset, dataOffset + compSize);

    entries.push({ name: nameStr, compression, compressed, uncompSize, dataOffset, compSize });
    offset = dataOffset + compSize;
    if (nameStr.endsWith('/')) continue; // directory entry
  }
  return entries;
}

async function decompressEntry(entry) {
  if (entry.compression === 0) {
    // Stored (no compression)
    return entry.compressed;
  }
  if (entry.compression === 8) {
    // DEFLATE — use native DecompressionStream
    try {
      const ds = new DecompressionStream('deflate-raw');
      const writer = ds.writable.getWriter();
      writer.write(new Uint8Array(entry.compressed));
      writer.close();
      const reader = ds.readable.getReader();
      const chunks = [];
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
      }
      // Combine chunks
      const total = chunks.reduce((s, c) => s + c.byteLength, 0);
      const result = new Uint8Array(total);
      let pos = 0;
      for (const c of chunks) { result.set(c, pos); pos += c.byteLength; }
      return result.buffer;
    } catch (e) {
      console.warn('DecompressionStream failed, trying fallback:', e);
      return entry.compressed; // return raw on failure
    }
  }
  console.warn('Unsupported ZIP compression:', entry.compression);
  return null;
}

// --- XML parsing via DOMParser ---
function xmlText(el, tag) {
  const node = el.querySelector(tag);
  return node?.textContent || '';
}

function parseSharedStrings(xmlStr) {
  const doc = new DOMParser().parseFromString(xmlStr, 'text/xml');
  const sis = doc.querySelectorAll('si');
  const strings = [];
  for (const si of sis) {
    const t = si.querySelector('t');
    strings.push(t ? t.textContent : '');
  }
  return strings;
}

function parseSheet(xmlStr, sharedStrings) {
  const doc = new DOMParser().parseFromString(xmlStr, 'text/xml');
  const rows = doc.querySelectorAll('row');
  const data = [];

  for (const row of rows) {
    const cells = row.querySelectorAll('c');
    const rowData = {};
    for (const cell of cells) {
      const ref = cell.getAttribute('r'); // e.g. A1, B2
      const type = cell.getAttribute('t');
      const vEl = cell.querySelector('v');
      if (!ref || !vEl) continue;
      const col = ref.match(/^[A-Z]+/)[0];
      const raw = vEl.textContent;
      let value = raw;
      if (type === 's' && sharedStrings && raw != null) {
        value = sharedStrings[parseInt(raw)] || raw;
      } else if (raw != null && !isNaN(raw)) {
        // Try to keep numbers as numbers, but strings as strings
        value = raw.includes('.') ? parseFloat(raw) : parseInt(raw, 10);
      }
      rowData[col] = value;
    }
    if (Object.keys(rowData).length > 0) {
      data.push(rowData);
    }
  }
  return data;
}

// Convert column-letter-indexed rows to header-keyed objects
function rowsToObjects(rows) {
  if (!rows || rows.length < 2) return [];
  const headers = rows[0];
  const result = [];
  // Find last non-empty column for header detection
  const colOrder = Object.keys(headers).sort((a, b) => {
    const toNum = (s) => {
      let n = 0;
      for (let i = 0; i < s.length; i++) n = n * 26 + (s.charCodeAt(i) - 64);
      return n;
    };
    return toNum(a) - toNum(b);
  });

  for (let r = 1; r < rows.length; r++) {
    const row = rows[r];
    const obj = {};
    for (const col of colOrder) {
      if (headers[col] != null && headers[col] !== '') {
        obj[String(headers[col])] = row[col] != null ? row[col] : '';
      }
    }
    result.push(obj);
  }
  return result;
}

// --- Main parser ---
export async function parseXLSX(arrayBuffer) {
  const entries = findLocalEntries(arrayBuffer);

  // Find shared strings and sheet1
  const ssEntry = entries.find(e => e.name === 'xl/sharedStrings.xml');
  const sheetEntry = entries.find(e => e.name === 'xl/worksheets/sheet1.xml');

  if (!sheetEntry) {
    throw new Error('Tidak dapat menemukan sheet data dalam file Excel');
  }

  const sheetData = await decompressEntry(sheetEntry);
  const sheetStr = new TextDecoder().decode(new Uint8Array(sheetData));

  let sharedStrings = [];
  if (ssEntry) {
    const ssData = await decompressEntry(ssEntry);
    const ssStr = new TextDecoder().decode(new Uint8Array(ssData));
    sharedStrings = parseSharedStrings(ssStr);
  }

  const rows = parseSheet(sheetStr, sharedStrings);
  return rowsToObjects(rows);
}

// --- Date normalizer: various formats → YYYY-MM-DD ---
function normalizeDate(value) {
  if (!value || !value.trim()) return '';
  const s = value.trim();

  // Already ISO format YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;

  // Try DD/MM/YYYY, DD/MM/YY, DD-MM-YYYY, DD-MM-YY, DD.MM.YYYY, DD.MM.YY
  const m = s.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{2,4})$/);
  if (m) {
    let [, d, mon, y] = m;
    d = d.padStart(2, '0');
    mon = mon.padStart(2, '0');
    if (y.length === 2) y = '20' + y; // assume 2000s
    return `${y}-${mon}-${d}`;
  }

  // Could not parse — return as-is, new Date() will try its best
  return s;
}

// --- Column mapping to our schema ---
// Flexible keyword matching for common Indonesian posyandu column names
const COLUMN_MAP = [
  { field: 'name', keywords: ['nama', 'nama anak', 'nama balita'] },
  { field: 'gender', keywords: ['jk', 'jenis kelamin', 'kelamin', 'l/p', 'sex'] },
  { field: 'birthDate', keywords: ['tgl lahir', 'tanggal lahir', 'tgl.lahir', 'birth date', 'ttl'] },
  { field: 'parentName', keywords: ['nama orang tua', 'orang tua', 'ortu', 'nama ayah', 'nama ibu'] },
  { field: 'address', keywords: ['alamat', 'address'] },
  { field: 'weight', keywords: ['bb', 'berat', 'berat badan', 'bb (kg)', 'weight'] },
  { field: 'height', keywords: ['tb', 'tinggi', 'tinggi badan', 'tb (cm)', 'height', 'panjang badan', 'pb'] },
  { field: 'measurementDate', keywords: ['tgl ukur', 'tanggal ukur', 'tgl pengukuran', 'tanggal', 'date'] },
];

export function normalizeRow(obj) {
  const result = {};
  const keys = Object.keys(obj).filter(k => k && k.trim());

  for (const { field, keywords } of COLUMN_MAP) {
    const match = keys.find(k =>
      keywords.some(kw => k.trim().toLowerCase().includes(kw))
    );
    result[field] = match ? String(obj[match]).trim().toUpperCase() : '';
  }

  // Handle gender normalization
  if (result.gender) {
    const g = result.gender.toLowerCase();
    if (g === 'l' || g === 'laki' || g === 'laki-laki' || g === 'laki laki') result.gender = 'L';
    else if (g === 'p' || g === 'perempuan' || g === 'wanita') result.gender = 'P';
  }

  // Parse weight/height to numbers
  if (result.weight) {
    const w = parseFloat(result.weight.replace(',', '.'));
    result.weight = isNaN(w) ? null : w;
  } else {
    result.weight = null;
  }
  if (result.height) {
    const h = parseFloat(result.height.replace(',', '.'));
    result.height = isNaN(h) ? null : h;
  } else {
    result.height = null;
  }

  // Normalize dates: support DD/MM/YYYY, DD/MM/YY, DD-MM-YYYY, DD-MM-YY, DD.MM.YYYY
  result.birthDate = normalizeDate(result.birthDate);
  result.measurementDate = normalizeDate(result.measurementDate);

  return result;
}
