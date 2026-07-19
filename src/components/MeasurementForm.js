'use client';

import { useState, useEffect } from 'react';
import { useArchive } from '@/context/ArchiveContext';

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
  if (!isoDate || typeof isoDate !== 'string') return '';
  const parts = isoDate.split('-');
  if (parts.length !== 3 || parts[0].length !== 4) return isoDate; // not ISO, show raw
  return `${parts[2]}-${parts[1]}-${parts[0]}`;
}

function SegmentedToggle({ options, value, onChange }) {
  return (
    <div
      className="inline-flex rounded-xl border p-0.5"
      style={{
        borderColor: 'var(--md-outline-variant)',
        backgroundColor: 'var(--md-surface-container)',
      }}
    >
      {options.map(opt => {
        const active = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className="px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap"
            style={{
              backgroundColor: active ? 'var(--md-primary)' : 'transparent',
              color: active ? 'var(--md-on-primary)' : 'var(--md-on-surface-variant)',
            }}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

export default function MeasurementForm({ initialData, onSubmit, isEditing, onCancelEdit, selectedIndex = 'ringkasan' }) {
  const { archiveMode } = useArchive();
  const [errors, setErrors] = useState({});
  const info = INDEX_INFO[selectedIndex] || INDEX_INFO.ringkasan;
  const [usiaMode, setUsiaMode] = useState('date');

  const [form, setForm] = useState({
    name: '', birthDate: '', gender: '', parentName: '', address: '',
    measurementDate: new Date().toISOString().split('T')[0],
    weight: '', height: '', usiaBulan: '',
  });

  useEffect(() => {
    const hasBirthDate = !!initialData?.birthDate;
    setUsiaMode(hasBirthDate || !archiveMode ? 'date' : 'months');
    setForm({
      name: initialData?.name || '', birthDate: initialData?.birthDate || '',
      gender: initialData?.gender || '', parentName: initialData?.parentName || '',
      address: initialData?.address || '',
      measurementDate: initialData?.measurementDate || new Date().toISOString().split('T')[0],
      weight: initialData?.weight ?? '', height: initialData?.height ?? '',
      usiaBulan: initialData?.umurBulan ?? '',
    });
    setErrors({});
  }, [initialData, archiveMode]);

  useEffect(() => {
    if (!archiveMode && usiaMode === 'date' && !form.birthDate) setUsiaMode('months');
  }, [archiveMode]);

  function setField(field, value) {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  }

  function validate() {
    const errs = {};
    const needsName = archiveMode;
    const needsBirth = usiaMode === 'date';
    const needsMonths = usiaMode === 'months';

    if (needsName && !form.name.trim()) errs.name = 'Nama anak wajib diisi';
    if (needsBirth && !form.birthDate) errs.birthDate = 'Tanggal lahir wajib diisi';
    if (needsMonths && (!form.usiaBulan || isNaN(form.usiaBulan) || Number(form.usiaBulan) < 0 || Number(form.usiaBulan) > 60)) {
      errs.usiaBulan = 'Usia harus 0–60 bulan';
    }
    if (!form.gender) errs.gender = 'Pilih jenis kelamin';
    if (info.weight && (!form.weight || isNaN(form.weight) || Number(form.weight) <= 0)) errs.weight = 'Berat badan harus angka > 0';
    if (info.height && (!form.height || isNaN(form.height) || Number(form.height) <= 0)) errs.height = 'Tinggi badan harus angka > 0';
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
      : form.birthDate ? Math.round((refDate - new Date(form.birthDate)) / (1000 * 60 * 60 * 24 * 30.44)) : null;
    onSubmit({ ...form, weight: info.weight ? Number(form.weight) : null, height: info.height ? Number(form.height) : null, usiaMode, umurBulan });
  }

  const heading = selectedIndex === 'ringkasan'
    ? (archiveMode ? 'Data Anak & Pengukuran' : 'Input Pengukuran')
    : info.title;

  const s = {
    label: 'block text-sm font-medium mb-1',
    labelStyle: { color: 'var(--md-on-surface-variant)' },
    err: 'text-xs mt-1',
    errStyle: { color: 'var(--md-error)' },
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <h2 className="text-lg font-semibold" style={{ color: 'var(--md-on-surface)' }}>{heading}</h2>

      {archiveMode && (
        <>
          <div>
            <label className={s.label} style={s.labelStyle} htmlFor="name">Nama Anak <span style={{ color: 'var(--md-error)' }}>*</span></label>
            <input id="name" className="input-field" value={form.name} onChange={e => setField('name', e.target.value)} placeholder="Nama lengkap anak" />
            {errors.name && <p className={s.err} style={s.errStyle}>{errors.name}</p>}
          </div>

          <SegmentedToggle
            options={[{ value: 'date', label: 'Tanggal Lahir' }, { value: 'months', label: 'Usia (bulan)' }]}
            value={usiaMode} onChange={setUsiaMode}
          />

          {usiaMode === 'date' ? (
            <div>
              <label className={s.label} style={s.labelStyle} htmlFor="birthDate">Tanggal Lahir <span style={{ color: 'var(--md-error)' }}>*</span></label>
              <input id="birthDate" type="date" className="input-field" value={form.birthDate} onChange={e => setField('birthDate', e.target.value)} />
              {form.birthDate && <p className="text-xs mt-0.5" style={{ color: 'var(--md-on-surface-variant)' }}>{formatDate(form.birthDate)}</p>}
              {errors.birthDate && <p className={s.err} style={s.errStyle}>{errors.birthDate}</p>}
            </div>
          ) : (
            <div>
              <label className={s.label} style={s.labelStyle} htmlFor="usiaBulan">Usia (bulan) <span style={{ color: 'var(--md-error)' }}>*</span></label>
              <input id="usiaBulan" type="number" min="0" max="60" className="input-field" value={form.usiaBulan} onChange={e => setField('usiaBulan', e.target.value)} placeholder="0–60" />
              {errors.usiaBulan && <p className={s.err} style={s.errStyle}>{errors.usiaBulan}</p>}
            </div>
          )}

          <div>
            <label className={s.label} style={s.labelStyle} htmlFor="parentName">Nama Orang Tua</label>
            <input id="parentName" className="input-field" value={form.parentName} onChange={e => setField('parentName', e.target.value)} placeholder="Opsional" />
          </div>

          <div>
            <label className={s.label} style={s.labelStyle} htmlFor="address">Alamat</label>
            <textarea id="address" className="input-field" rows={2} value={form.address} onChange={e => setField('address', e.target.value)} placeholder="Opsional" />
          </div>
        </>
      )}

      {!archiveMode && (
        <>
          <SegmentedToggle
            options={[{ value: 'date', label: 'Tanggal Lahir' }, { value: 'months', label: 'Usia (bulan)' }]}
            value={usiaMode} onChange={setUsiaMode}
          />
          {usiaMode === 'date' ? (
            <div>
              <label className={s.label} style={s.labelStyle} htmlFor="birthDate">Tanggal Lahir <span style={{ color: 'var(--md-error)' }}>*</span></label>
              <input id="birthDate" type="date" className="input-field" value={form.birthDate} onChange={e => setField('birthDate', e.target.value)} />
              {form.birthDate && <p className="text-xs mt-0.5" style={{ color: 'var(--md-on-surface-variant)' }}>{formatDate(form.birthDate)}</p>}
              {errors.birthDate && <p className={s.err} style={s.errStyle}>{errors.birthDate}</p>}
            </div>
          ) : (
            <div>
              <label className={s.label} style={s.labelStyle} htmlFor="usiaBulan">Usia (bulan) <span style={{ color: 'var(--md-error)' }}>*</span></label>
              <input id="usiaBulan" type="number" min="0" max="60" className="input-field" value={form.usiaBulan} onChange={e => setField('usiaBulan', e.target.value)} placeholder="0–60" />
              {errors.usiaBulan && <p className={s.err} style={s.errStyle}>{errors.usiaBulan}</p>}
            </div>
          )}
        </>
      )}

      {/* Gender — MD3 radio chips */}
      <fieldset>
        <legend className={s.label} style={s.labelStyle}>Jenis Kelamin <span style={{ color: 'var(--md-error)' }}>*</span></legend>
        <div className="flex gap-3">
          {GENDER_OPTIONS.map(opt => {
            const active = form.gender === opt.value;
            return (
              <label key={opt.value}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl px-4 py-3 cursor-pointer text-sm font-medium transition-colors border"
                style={{
                  backgroundColor: active ? 'var(--md-secondary-container)' : 'transparent',
                  color: active ? 'var(--md-on-secondary-container)' : 'var(--md-on-surface-variant)',
                  borderColor: active ? 'var(--md-secondary-container)' : 'var(--md-outline-variant)',
                }}>
                <input type="radio" name="gender" value={opt.value}
                  checked={active} onChange={e => setField('gender', e.target.value)} className="sr-only" />
                {opt.label}
              </label>
            );
          })}
        </div>
        {errors.gender && <p className={s.err} style={s.errStyle}>{errors.gender}</p>}
      </fieldset>

      {/* Measurement fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {archiveMode && (
          <div>
            <label className={s.label} style={s.labelStyle} htmlFor="measurementDate">Tanggal Ukur</label>
            <input id="measurementDate" type="date" className="input-field" value={form.measurementDate} onChange={e => setField('measurementDate', e.target.value)} />
            {form.measurementDate && <p className="text-xs mt-0.5" style={{ color: 'var(--md-on-surface-variant)' }}>{formatDate(form.measurementDate)}</p>}
          </div>
        )}

        {info.weight && (
          <div>
            <label className={s.label} style={s.labelStyle} htmlFor="weight">Berat Badan (kg) <span style={{ color: 'var(--md-error)' }}>*</span></label>
            <input id="weight" type="number" step="0.1" min="0.5" max="50" className="input-field" value={form.weight} onChange={e => setField('weight', e.target.value)} placeholder="Contoh: 8.5" />
            {errors.weight && <p className={s.err} style={s.errStyle}>{errors.weight}</p>}
          </div>
        )}

        {info.height && (
          <div>
            <label className={s.label} style={s.labelStyle} htmlFor="height">Tinggi Badan (cm) <span style={{ color: 'var(--md-error)' }}>*</span></label>
            <input id="height" type="number" step="0.1" min="20" max="150" className="input-field" value={form.height} onChange={e => setField('height', e.target.value)} placeholder="Contoh: 65.5" />
            {errors.height && <p className={s.err} style={s.errStyle}>{errors.height}</p>}
          </div>
        )}
      </div>

      {/* Submit buttons — MD3 filled & tonal */}
      <div className="flex gap-3 pt-2">
        {isEditing && (
          <button type="button" onClick={onCancelEdit}
            className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors"
            style={{
              backgroundColor: 'var(--md-surface-container-high)',
              color: 'var(--md-on-surface)',
            }}>
            Batal
          </button>
        )}
        <button type="submit"
          className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors"
          style={{
            backgroundColor: 'var(--md-primary)',
            color: 'var(--md-on-primary)',
          }}>
          {isEditing ? 'Perbarui' : archiveMode ? 'Simpan & Hitung' : 'Hitung'}
        </button>
      </div>
    </form>
  );
}
