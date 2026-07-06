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
import { getAllRecords, addRecord, updateRecord } from '@/lib/db';

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
          />
        )}
      </main>

      <ManualModal open={manualOpen} onClose={() => setManualOpen(false)} />

      {toast && (
        <div className={`fixed bottom-4 right-4 z-50 rounded-lg px-4 py-3 text-sm text-white shadow-lg animate-slide-up ${toast.type === 'error' ? 'bg-danger' : 'bg-accent'}`}>
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
