'use client';

import { useState, useCallback, useEffect } from 'react';

import { ThemeProvider } from '@/context/ThemeContext';
import { ArchiveProvider, useArchive } from '@/context/ArchiveContext';
import TopBar from '@/components/TopBar';
import IndexBar from '@/components/IndexBar';
import MeasurementForm from '@/components/MeasurementForm';
import ResultCard from '@/components/ResultCard';
import ArchiveList from '@/components/ArchiveList';
import ManualModal from '@/components/ManualModal';
import { hitungStatusGizi } from '@/lib/calc';
import { getAllRecords, addRecord, updateRecord, importRecords } from '@/lib/db';
import { parseXLSX, normalizeRow } from '@/lib/xlsx';
import Papa from 'papaparse';

function HomePage() {
  const [manualOpen, setManualOpen] = useState(false);
  const [result, setResult] = useState(null);
  const [records, setRecords] = useState([]);
  const [editingRecord, setEditingRecord] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [toast, setToast] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState('ringkasan');
  const { archiveMode } = useArchive();

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const loadRecords = useCallback(async () => {
    try {
      const data = await getAllRecords();
      setRecords(data);
    } catch (e) {
      console.error('Gagal memuat catatan:', e);
    }
  }, []);

  // Load records on mount & when archive mode activates
  useEffect(() => {
    if (archiveMode) loadRecords();
  }, [archiveMode, loadRecords]);

  async function handleSubmit(data) {
    const umurBulan = data.umurBulan;
    const gziResult = hitungStatusGizi(umurBulan, data.gender, data.weight, data.height);
    setResult(gziResult);

    if (archiveMode) {
      const record = {
        name: data.name,
        birthDate: data.birthDate,
        gender: data.gender,
        parentName: data.parentName,
        address: data.address,
        measurementDate: data.measurementDate,
        weight: data.weight,
        height: data.height,
        umurBulan,
        status: gziResult.status.label,
        statusKey: gziResult.status.key,
      };

      try {
        if (editingRecord) {
          await updateRecord({ ...record, id: editingRecord.id });
          showToast('Data diperbarui');
        } else {
          await addRecord(record);
          showToast('Data tersimpan');
        }
        setEditingRecord(null);
        setRefreshKey(k => k + 1);
        await loadRecords();
      } catch (e) {
        showToast('Gagal menyimpan data', 'error');
      }
    }
  }

  function handleEdit(rec) {
    setEditingRecord(rec);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleCancelEdit() {
    setEditingRecord(null);
  }

  async function handleImport(file) {
    try {
      showToast('Membaca file...', 'info');
      const isCSV = file.name.endsWith('.csv');
      let rows;

      if (isCSV) {
        const text = await file.text();
        const parsed = Papa.parse(text, { header: true, skipEmptyLines: true });
        rows = parsed.data;
      } else {
        const buffer = await file.arrayBuffer();
        rows = await parseXLSX(buffer);
      }

      if (!rows || rows.length === 0) {
        showToast('Tidak ada data yang ditemukan dalam file', 'error');
        return;
      }

      const normalized = rows.map(normalizeRow).filter(r => r.name && r.name.trim());

      if (normalized.length === 0) {
        showToast('Tidak ada data valid (nama tidak ditemukan)', 'error');
        return;
      }

      // Auto-detect gender from first row with data if most rows have it
      // Also try to derive measurementDate from filename or use today
      const today = new Date().toISOString().split('T')[0];
      const recordsToImport = normalized.map(r => {
        const umurBulan = r.birthDate
          ? Math.round((new Date() - new Date(r.birthDate)) / (1000 * 60 * 60 * 24 * 30.44))
          : null;
        return {
          name: r.name,
          birthDate: r.birthDate || '',
          gender: r.gender || '',
          parentName: r.parentName || '',
          address: r.address || '',
          measurementDate: r.measurementDate || today,
          weight: r.weight,
          height: r.height,
          umurBulan,
          status: '',
          statusKey: '',
        };
      });

      const { added, skipped, records: savedRecs } = await importRecords(recordsToImport);

      // Set status: "Tidak Ada Data" for null measurements, else calculate
      for (const rec of savedRecs) {
        if (!rec.weight || !rec.height || rec.umurBulan == null) {
          rec.status = 'Tidak Ada Data';
          rec.statusKey = 'tidakAdaData';
          await updateRecord(rec);
          continue;
        }
        try {
          const result = hitungStatusGizi(rec.umurBulan, rec.gender || 'L', rec.weight, rec.height);
          rec.status = result.status.label;
          rec.statusKey = result.status.key;
          await updateRecord(rec);
        } catch (e) {
          console.warn('Gagal kalkulasi untuk', rec.name, e);
        }
      }

      await loadRecords();
      showToast(`${added} data berhasil diimpor${skipped > 0 ? `, ${skipped} dilewati (duplikat)` : ''}`, 'success');
    } catch (e) {
      console.error('Import gagal:', e);
      showToast('Gagal mengimpor file: ' + e.message, 'error');
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <TopBar onOpenManual={() => setManualOpen(true)} />
      <IndexBar selectedIndex={selectedIndex} onSelectIndex={setSelectedIndex} />

      <main className="flex-1 mx-auto w-full max-w-content px-4 py-6">
        <MeasurementForm
          initialData={editingRecord}
          onSubmit={handleSubmit}
          isEditing={!!editingRecord}
          onCancelEdit={handleCancelEdit}
          selectedIndex={selectedIndex}
        />

        {result && <ResultCard result={result} selectedIndex={selectedIndex} />}

        {archiveMode && (
          <ArchiveList
            records={records}
            onEdit={handleEdit}
            refreshKey={refreshKey}
            onRefresh={loadRecords}
            onImport={handleImport}
          />
        )}
      </main>

      <ManualModal open={manualOpen} onClose={() => setManualOpen(false)} />

      {toast && (
        <div className="fixed bottom-4 right-4 z-50 rounded-lg px-4 py-3 text-sm shadow-lg animate-slide-up"
          style={{
            backgroundColor: toast.type === 'error' ? 'var(--md-error)' : toast.type === 'info' ? 'var(--md-primary)' : 'var(--md-primary)',
            color: toast.type === 'error' ? 'var(--md-on-error)' : 'var(--md-on-primary)',
          }}>
          {toast.message}
        </div>
      )}
    </div>
  );
}

export default function Page() {
  return (
    <ThemeProvider>
      <ArchiveProvider>
        <HomePage />
      </ArchiveProvider>
    </ThemeProvider>
  );
}
