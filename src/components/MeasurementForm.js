'use client';

import { useState, useEffect } from 'react';
import { useArchive } from '@/context/ArchiveContext';

// ponytail: single form component for both modes — archive fields shown conditionally
const GENDER_OPTIONS = [
  { value: 'L', label: 'Laki-laki' },
  { value: 'P', label: 'Perempuan' },
];

const INDEX_INFO = {
  ringkasan: { title: 'Semua Indeks', weight: true, height: true },
  bbu:  { title: 'BB/U — Berat Badan menurut Umur', weight: true, height: false },
  tbu:  { title: 'TB/U — Tinggi Badan menurut Umur', weight: false, height: true },
  bbtb: { title: 'BB/TB — Berat Badan menurut Tinggi Badan', weight: true, height: true },
  imtu: { title: 'IMT/U — Indeks Massa Tubuh menurut Umur', weight: true, height: true },
};

function formatDate(isoDate) {
  if (!isoDate) return '';
  const [y, m, d] = isoDate.split('-');
  return `${d}-${m}-${y}`;
}

export default function MeasurementForm({ initialData, onSubmit, isEditing, onCancelEdit, selectedIndex = 'ringkasan' }) {
  const { archiveMode } = useArchive();
  const [errors, setErrors] = useState({});
  const info = INDEX_INFO[selectedIndex] || INDEX_INFO.ringkasan;

  // usiaMode: 'date' = input tanggal lahir, 'months' = langsung bulan
  const [usiaMode, setUsiaMode] = useState('date');

  const [form, setForm] = useState({
    name: '',
    birthDate: '',
    gender: '',
    parentName: '',
    address: '',
    measurementDate: new Date().toISOString().split('T')[0],
    weight: '',
    height: '',
    usiaBulan: '',
  });

  // Sync form when initialData changes (edit record, cancel edit, new record)
  useEffect(() => {
    // Determine usiaMode from initialData: if birthDate exists, prefer date; otherwise months
    const hasBirthDate = !!initialData?.birthDate;
    setUsiaMode(hasBirthDate || !archiveMode ? 'date' : 'months');

    setForm({
      name: initialData?.name || '',
      birthDate: initialData?.birthDate || '',
      gender: initialData?.gender || '',
      parentName: initialData?.parentName || '',
      address: initialData?.address || '',
      measurementDate: initialData?.measurementDate || new Date().toISOString().split('T')[0],
      weight: initialData?.weight ?? '',
      height: initialData?.height ?? '',
      usiaBulan: initialData?.umurBulan ?? '',
    });
    setErrors({});
  }, [initialData, archiveMode]);

  // Reset usiaMode to months when opening non-archive for first time (but let user toggle freely)
  useEffect(() => {
    if (!archiveMode && usiaMode === 'date' && !form.birthDate) setUsiaMode('months');
  }, [archiveMode]);

  function setField(field, value) {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  }

  function validate() {
    const errs = {};
    if (archiveMode) {
      if (!form.name.trim()) errs.name = 'Nama anak wajib diisi';

      if (usiaMode === 'date') {
        if (!form.birthDate) errs.birthDate = 'Tanggal lahir wajib diisi';
      } else {
        if (!form.usiaBulan || isNaN(form.usiaBulan) || Number(form.usiaBulan) < 0 || Number(form.usiaBulan) > 60) {
          errs.usiaBulan = 'Usia harus 0–60 bulan';
        }
      }
    } else {
      if (usiaMode === 'date') {
        if (!form.birthDate) errs.birthDate = 'Tanggal lahir wajib diisi';
      } else {
        if (!form.usiaBulan || isNaN(form.usiaBulan) || Number(form.usiaBulan) < 0 || Number(form.usiaBulan) > 60) {
          errs.usiaBulan = 'Usia harus 0–60 bulan';
        }
      }
    }

    if (!form.gender) errs.gender = 'Pilih jenis kelamin';

    if (info.weight) {
      if (!form.weight || isNaN(form.weight) || Number(form.weight) <= 0) errs.weight = 'Berat badan harus angka > 0';
    }
    if (info.height) {
      if (!form.height || isNaN(form.height) || Number(form.height) <= 0) errs.height = 'Tinggi badan harus angka > 0';
    }

    if (usiaMode === 'date' && form.birthDate) {
      const bd = new Date(form.birthDate);
      const refDate = form.measurementDate ? new Date(form.measurementDate) : new Date();
      const ageMonths = (refDate - bd) / (1000 * 60 * 60 * 24 * 30.44);
      if (ageMonths < 0 || ageMonths > 60) errs.birthDate = 'Usia harus 0–60 bulan dari tanggal referensi';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    const refDate = form.measurementDate ? new Date(form.measurementDate) : new Date();
    const umurBulan = usiaMode === 'months'
      ? Number(form.usiaBulan)
      : form.birthDate
        ? Math.round((refDate - new Date(form.birthDate)) / (1000 * 60 * 60 * 24 * 30.44))
        : null;

    onSubmit({
      ...form,
      weight: info.weight ? Number(form.weight) : null,
      height: info.height ? Number(form.height) : null,
      usiaMode,
      umurBulan,
    });
  }

  const inputClass = 'input-field';
  const labelClass = 'label';

  const heading = selectedIndex === 'ringkasan'
    ? (archiveMode ? 'Data Anak & Pengukuran' : 'Input Pengukuran')
    : info.title;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-lg font-semibold text-text-primary">{heading}</h2>

      {archiveMode && (
        <>
          <div>
            <label className={labelClass} htmlFor="name">Nama Anak <span className="text-danger">*</span></label>
            <input id="name" className={inputClass} value={form.name} onChange={e => setField('name', e.target.value)} placeholder="Nama lengkap anak" />
            {errors.name && <p className="text-danger text-xs mt-1">{errors.name}</p>}
          </div>

          {/* Toggle usia mode */}
          <div className="flex gap-1.5 p-1 bg-surface rounded-lg border border-border w-fit">
            <button type="button" onClick={() => setUsiaMode('date')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${usiaMode === 'date' ? 'bg-accent text-white shadow-sm' : 'text-text-secondary hover:text-text-primary'}`}>
              Tanggal Lahir
            </button>
            <button type="button" onClick={() => setUsiaMode('months')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${usiaMode === 'months' ? 'bg-accent text-white shadow-sm' : 'text-text-secondary hover:text-text-primary'}`}>
              Usia (bulan)
            </button>
          </div>

          {usiaMode === 'date' ? (
            <div>
              <label className={labelClass} htmlFor="birthDate">Tanggal Lahir <span className="text-danger">*</span></label>
              <input id="birthDate" type="date" className={inputClass} value={form.birthDate} onChange={e => setField('birthDate', e.target.value)} />
              {form.birthDate && <p className="text-xs text-text-secondary mt-0.5">{formatDate(form.birthDate)}</p>}
              {errors.birthDate && <p className="text-danger text-xs mt-1">{errors.birthDate}</p>}
            </div>
          ) : (
            <div>
              <label className={labelClass} htmlFor="usiaBulan">Usia (bulan) <span className="text-danger">*</span></label>
              <input id="usiaBulan" type="number" min="0" max="60" className={inputClass} value={form.usiaBulan} onChange={e => setField('usiaBulan', e.target.value)} placeholder="0–60" />
              {errors.usiaBulan && <p className="text-danger text-xs mt-1">{errors.usiaBulan}</p>}
            </div>
          )}

          <div>
            <label className={labelClass} htmlFor="parentName">Nama Orang Tua</label>
            <input id="parentName" className={inputClass} value={form.parentName} onChange={e => setField('parentName', e.target.value)} placeholder="Opsional" />
          </div>

          <div>
            <label className={labelClass} htmlFor="address">Alamat</label>
            <textarea id="address" className={inputClass} rows={2} value={form.address} onChange={e => setField('address', e.target.value)} placeholder="Opsional" />
          </div>
        </>
      )}

      {!archiveMode && (
        <>
          <div className="flex gap-1.5 p-1 bg-surface rounded-lg border border-border w-fit">
            <button type="button" onClick={() => setUsiaMode('date')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${usiaMode === 'date' ? 'bg-accent text-white shadow-sm' : 'text-text-secondary hover:text-text-primary'}`}>
              Tanggal Lahir
            </button>
            <button type="button" onClick={() => setUsiaMode('months')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${usiaMode === 'months' ? 'bg-accent text-white shadow-sm' : 'text-text-secondary hover:text-text-primary'}`}>
              Usia (bulan)
            </button>
          </div>

          {usiaMode === 'date' ? (
            <div>
              <label className={labelClass} htmlFor="birthDate">Tanggal Lahir <span className="text-danger">*</span></label>
              <input id="birthDate" type="date" className={inputClass} value={form.birthDate} onChange={e => setField('birthDate', e.target.value)} />
              {form.birthDate && <p className="text-xs text-text-secondary mt-0.5">{formatDate(form.birthDate)}</p>}
              {errors.birthDate && <p className="text-danger text-xs mt-1">{errors.birthDate}</p>}
            </div>
          ) : (
            <div>
              <label className={labelClass} htmlFor="usiaBulan">Usia (bulan) <span className="text-danger">*</span></label>
              <input id="usiaBulan" type="number" min="0" max="60" className={inputClass} value={form.usiaBulan} onChange={e => setField('usiaBulan', e.target.value)} placeholder="0–60" />
              {errors.usiaBulan && <p className="text-danger text-xs mt-1">{errors.usiaBulan}</p>}
            </div>
          )}
        </>
      )}

      {/* Gender */}
      <fieldset>
        <legend className={labelClass}>Jenis Kelamin <span className="text-danger">*</span></legend>
        <div className="flex gap-3">
          {GENDER_OPTIONS.map(opt => (
            <label key={opt.value} className={`flex-1 flex items-center justify-center gap-2 rounded-lg border px-4 py-2.5 cursor-pointer text-sm font-medium transition-colors
              ${form.gender === opt.value ? 'border-accent bg-accent/5 text-accent' : 'border-border text-text-secondary hover:border-accent/50'}`}>
              <input
                type="radio"
                name="gender"
                value={opt.value}
                checked={form.gender === opt.value}
                onChange={e => setField('gender', e.target.value)}
                className="sr-only"
              />
              {opt.label}
            </label>
          ))}
        </div>
        {errors.gender && <p className="text-danger text-xs mt-1">{errors.gender}</p>}
      </fieldset>

      {/* Measurement fields — shown/hidden based on selected index */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {archiveMode && (
          <div>
            <label className={labelClass} htmlFor="measurementDate">Tanggal Ukur</label>
            <input id="measurementDate" type="date" className={inputClass} value={form.measurementDate} onChange={e => setField('measurementDate', e.target.value)} />
            {form.measurementDate && <p className="text-xs text-text-secondary mt-0.5">{formatDate(form.measurementDate)}</p>}
          </div>
        )}

        {info.weight && (
          <div>
            <label className={labelClass} htmlFor="weight">Berat Badan (kg) <span className="text-danger">*</span></label>
            <input id="weight" type="number" step="0.1" min="0.5" max="50" className={inputClass} value={form.weight} onChange={e => setField('weight', e.target.value)} placeholder="Contoh: 8.5" />
            {errors.weight && <p className="text-danger text-xs mt-1">{errors.weight}</p>}
          </div>
        )}

        {info.height && (
          <div className={info.weight ? 'sm:col-span-1' : 'sm:col-span-2'}>
            <label className={labelClass} htmlFor="height">Tinggi Badan (cm) <span className="text-danger">*</span></label>
            <input id="height" type="number" step="0.1" min="20" max="150" className={inputClass} value={form.height} onChange={e => setField('height', e.target.value)} placeholder="Contoh: 65.5" />
            {errors.height && <p className="text-danger text-xs mt-1">{errors.height}</p>}
          </div>
        )}
      </div>

      <div className="flex gap-2 pt-2">
        {isEditing && (
          <button type="button" onClick={onCancelEdit} className="btn-secondary flex-1">
            Batal
          </button>
        )}
        <button type="submit" className="btn-primary flex-1">
          {isEditing ? 'Perbarui' : archiveMode ? 'Simpan & Hitung' : 'Hitung'}
        </button>
      </div>
    </form>
  );
}
