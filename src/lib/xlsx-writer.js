// ponytail: minimal xlsx writer — no dependencies, generates styled cells via raw XML + ZIP
// Known ceiling: single sheet, no formulas, no merged cells, basic fills only
import { hitungStatusGizi } from './calc';

// Status → fill color mapping (Material Design inspired)
const STATUS_FILLS = {
  'Gizi Buruk':    'FFCDD2', // red-100
  'Gizi Kurang':   'FFF9C4', // yellow-100
  'Gizi Baik':     'C8E6C9', // green-100
  'Berisiko Gizi Lebih': 'FFF9C4',
  'Gizi Lebih':    'FFF9C4',
  'Obesitas':      'FFCDD2',
  'Sangat Pendek': 'FFCDD2',
  'Pendek':        'FFF9C4',
  'Tinggi':        'BBDEFB', // blue-100
  'Normal':        'C8E6C9',
  'Berat Badan Sangat Kurang': 'FFCDD2',
  'Berat Badan Kurang': 'FFF9C4',
  'Berat Badan Normal': 'C8E6C9',
  'Risiko Berat Badan Lebih': 'FFF9C4',
  'Tidak Ada Data': 'E0E0E0', // gray-300
};
const DEFAULT_FILL = 'FFFFFF';

// --- ZIP writer ---
function crc32(data) {
  let c = 0xFFFFFFFF;
  const table = new Int32Array(256);
  for (let i = 0; i < 256; i++) {
    let crc = i;
    for (let j = 0; j < 8; j++) crc = crc & 1 ? 0xEDB88320 ^ (crc >>> 1) : crc >>> 1;
    table[i] = crc;
  }
  for (let i = 0; i < data.length; i++) c = table[(c ^ data[i]) & 0xFF] ^ (c >>> 8);
  return (c ^ 0xFFFFFFFF) >>> 0;
}

function putUint32(view, offset, val) { view.setUint32(offset, val, true); }
function putUint16(view, offset, val) { view.setUint16(offset, val, true); }

function makeZIP(files) {
  // files: [{name, data: Uint8Array}]
  const encoder = new TextEncoder();
  const entries = files.map(f => ({
    nameBytes: encoder.encode(f.name),
    data: f.data,
    crc: crc32(f.data),
    comp: f.data, // stored (no compression) — simpler
  }));

  // Calculate sizes
  let offset = 0;
  const localHeaders = [];
  const centralEntries = [];

  for (const e of entries) {
    const nameLen = e.nameBytes.length;
    const localSize = 30 + nameLen + e.data.byteLength;
    localHeaders.push({ offset, nameLen, ...e });
    centralEntries.push({ localOffset: offset, nameLen, ...e });
    offset += localSize;
  }

  const centralStart = offset;
  let centralSize = 0;
  for (const e of centralEntries) {
    centralSize += 46 + e.nameLen; // central dir entry size
  }
  const endOffset = centralStart + centralSize;

  const buf = new ArrayBuffer(endOffset + 22); // + end of central directory
  const view = new DataView(buf);
  let pos = 0;

  function writeSig(sig) { putUint32(view, pos, sig); pos += 4; }
  function writeU16(v) { putUint16(view, pos, v); pos += 2; }
  function writeU32(v) { putUint32(view, pos, v); pos += 4; }
  function writeBytes(arr) { new Uint8Array(buf, pos, arr.length).set(arr); pos += arr.length; }
  function writeStr(s) { const b = encoder.encode(s); writeBytes(b); }

  // Local file headers
  for (const e of localHeaders) {
    writeSig(0x04034b50);       // local header sig
    writeU16(20);               // version needed
    writeU16(0);                // flags
    writeU16(0);                // compression (stored)
    writeU16(0);                // mod time
    writeU16(0);                // mod date
    writeU32(e.crc);            // crc32
    writeU32(e.data.byteLength); // compressed size
    writeU32(e.data.byteLength); // uncompressed size
    writeU16(e.nameLen);        // filename length
    writeU16(0);                // extra field length
    writeBytes(e.nameBytes);    // filename
    writeBytes(new Uint8Array(e.data)); // file data
  }

  // Central directory
  for (const e of centralEntries) {
    writeSig(0x02014b50);       // central dir sig
    writeU16(20);               // version made by
    writeU16(20);               // version needed
    writeU16(0);                // flags
    writeU16(0);                // compression
    writeU16(0);                // mod time
    writeU16(0);                // mod date
    writeU32(e.crc);            // crc32
    writeU32(e.data.byteLength); // compressed size
    writeU32(e.data.byteLength); // uncompressed size
    writeU16(e.nameLen);        // filename length
    writeU16(0);                // extra field length
    writeU16(0);                // file comment length
    writeU16(0);                // disk number start
    writeU16(0);                // internal attrs
    writeU32(0);                // external attrs
    writeU32(e.localOffset);    // local header offset
    writeBytes(e.nameBytes);
  }

  // End of central directory
  writeSig(0x06054b50);
  writeU16(0);                  // disk #
  writeU16(0);                  // central dir disk #
  writeU16(centralEntries.length);
  writeU16(centralEntries.length);
  writeU32(centralSize);
  writeU32(centralStart);
  writeU16(0);                  // comment length

  return buf;
}

// --- XML builders ---
function escXml(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

function buildContentTypes() {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
<Default Extension="xml" ContentType="application/xml"/>
<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
<Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>
<Override PartName="/xl/sharedStrings.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sharedStrings+xml"/>
</Types>`;
}

function buildRels() {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
</Relationships>`;
}

function buildWorkbookRels() {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>
<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
<Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/sharedStrings" Target="sharedStrings.xml"/>
</Relationships>`;
}

function buildWorkbook() {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
<sheets><sheet name="Data" sheetId="1" r:id="rId1"/></sheets></workbook>`;
}

function buildStyles(uniqueFills) {
  let xml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
<fonts count="1"><font><sz val="11"/><name val="Calibri"/></font></fonts>
<fills count="${1 + 1 + uniqueFills.length}">
<fill><patternFill patternType="none"/></fill>
<fill><patternFill patternType="gray125"/></fill>`;

  for (const color of uniqueFills) {
    xml += `<fill><patternFill patternType="solid"><fgColor rgb="${color}"/><bgColor indexed="64"/></patternFill></fill>`;
  }

  xml += `</fills>
<colors/><borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders>
<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>
<cellXfs count="${1 + uniqueFills.length}">
<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>`;

  for (let i = 0; i < uniqueFills.length; i++) {
    const fillId = 2 + i;
    xml += `<xf numFmtId="0" fontId="0" fillId="${fillId}" borderId="0" xfId="0" applyFill="1"/>`;
  }

  xml += `</cellXfs>
</styleSheet>`;
  return xml;
}

function buildSharedStrings(strings) {
  let xml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<sst xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" count="${strings.length}" uniqueCount="${strings.length}">`;
  for (const s of strings) {
    xml += `<si><t>${escXml(s)}</t></si>`;
  }
  xml += `</sst>`;
  return xml;
}

function buildSheet(rows, strings, fillMap) {
  const strIndex = {};
  strings.forEach((s, i) => { strIndex[s] = i; });

  let xml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"
           xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
<cols>`;
  const colLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  for (let i = 0; i < (rows[0]?.length || 1); i++) {
    xml += `<col min="${i+1}" max="${i+1}" width="18" customWidth="1"/>`;
  }
  xml += `</cols><sheetData>`;

  for (let r = 0; r < rows.length; r++) {
    xml += `<row r="${r + 1}">`;
    for (let c = 0; c < rows[r].length; c++) {
      const val = rows[r][c] == null ? '' : String(rows[r][c]);
      const ref = colLetters[c] + (r + 1);
      const si = strIndex[val] != null ? strIndex[val] : -1;
      const fillIdx = fillMap[val] || 0;

      if (si >= 0) {
        xml += `<c r="${ref}" t="s" s="${fillIdx}"><v>${si}</v></c>`;
      } else if (val !== '' && !isNaN(val)) {
        xml += `<c r="${ref}" s="${fillIdx}"><v>${val}</v></c>`;
      } else {
        if (fillIdx > 0 && val === '') {
          const emptySi = strIndex[''] != null ? strIndex[''] : -1;
          if (emptySi >= 0) xml += `<c r="${ref}" t="s" s="${fillIdx}"><v>${emptySi}</v></c>`;
        } else {
          xml += `<c r="${ref}" s="${fillIdx}"><v>${escXml(val)}</v></c>`;
        }
      }
    }
    xml += `</row>`;
  }

  xml += `</sheetData></worksheet>`;
  return xml;
}

// --- Per-index status computation ---
function computeAllStatus(r) {
  const hasWeight = r.weight != null && r.weight !== '';
  const hasHeight = r.height != null && r.height !== '';
  const umurBulan = r.umurBulan != null ? r.umurBulan
    : r.birthDate ? Math.round((new Date() - new Date(r.birthDate)) / (1000 * 60 * 60 * 24 * 30.44)) : null;

  if (!umurBulan || umurBulan < 0 || umurBulan > 60 || (!hasWeight && !hasHeight)) {
    return { bbu: 'Tidak Ada Data', tbu: 'Tidak Ada Data', bbtb: 'Tidak Ada Data', imtu: 'Tidak Ada Data' };
  }

  const gender = r.gender || 'L';
  const bb = hasWeight ? Number(r.weight) : 3;
  const tb = hasHeight ? Number(r.height) : 50;
  const full = hitungStatusGizi(umurBulan, gender, bb, tb);

  const fallback = 'Tidak Ada Data';
  return {
    bbu: hasWeight ? full.indices.bbu.status.label : fallback,
    tbu: hasHeight ? full.indices.tbu.status.label : fallback,
    bbtb: (hasWeight && hasHeight) ? full.indices.bbtb.status.label : fallback,
    imtu: (hasWeight && hasHeight) ? full.indices.imtu.status.label : fallback,
  };
}

// --- Public API ---
export function downloadXLSX(records, statusField = 'status', filename = 'gizikita-data.xlsx') {
  const headers = ['Nama', 'JK', 'Tgl Lahir', 'Tgl Ukur', 'BB (kg)', 'TB (cm)',
    'Status BB/U', 'Status TB/U', 'Status BB/TB', 'Status IMT/U',
    'Nama Orang Tua', 'Alamat'];

  const dataRows = records.map(r => {
    const all = computeAllStatus(r);
    return [
      r.name ? r.name.toUpperCase() : '',
      r.gender === 'L' ? 'L' : 'P',
      r.birthDate || '',
      r.measurementDate || '',
      r.weight != null ? String(r.weight) : '',
      r.height != null ? String(r.height) : '',
      all.bbu,
      all.tbu,
      all.bbtb,
      all.imtu,
      r.parentName || '',
      r.address || '',
    ];
  });

  const allRows = [headers, ...dataRows];

  // Collect all unique strings
  const stringSet = new Set();
  for (const row of allRows) {
    for (const val of row) {
      if (val != null && val !== '') stringSet.add(String(val));
    }
  }
  stringSet.add('');
  const strings = Array.from(stringSet);

  // Determine fill per status value (from status columns 6-9)
  const usedFills = new Set();
  usedFills.add(DEFAULT_FILL);
  const fillForValue = {};
  for (const row of dataRows) {
    for (let ci = 6; ci < 10; ci++) {
      const status = row[ci];
      if (status) {
        const color = STATUS_FILLS[status] || DEFAULT_FILL;
        fillForValue[status] = color;
        usedFills.add(color);
      }
    }
  }
  const fillList = Array.from(usedFills);
  const fillIndex = {};
  fillList.forEach((c, i) => { fillIndex[c] = i; });

  const xfForValue = {};
  for (const [status, color] of Object.entries(fillForValue)) {
    xfForValue[status] = fillIndex[color];
  }

  const encoder = new TextEncoder();
  const files = [
    { name: '[Content_Types].xml', data: encoder.encode(buildContentTypes()) },
    { name: '_rels/.rels', data: encoder.encode(buildRels()) },
    { name: 'xl/_rels/workbook.xml.rels', data: encoder.encode(buildWorkbookRels()) },
    { name: 'xl/workbook.xml', data: encoder.encode(buildWorkbook()) },
    { name: 'xl/styles.xml', data: encoder.encode(buildStyles(fillList.filter(c => c !== DEFAULT_FILL))) },
    { name: 'xl/sharedStrings.xml', data: encoder.encode(buildSharedStrings(strings)) },
    { name: 'xl/worksheets/sheet1.xml', data: encoder.encode(buildSheet(allRows, strings, xfForValue)) },
  ];

  const zipBuf = makeZIP(files);
  const blob = new Blob([zipBuf], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
