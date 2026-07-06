# AGENTS.md — StatusGiziKu (root)

Root DOX rail. This file is the binding work contract for the entire repository.
Every agent working here must read it before editing.

## Purpose

StatusGiziKu — kalkulator status gizi balita dan anak (0–60 bulan), offline-first.
Menghitung BB/U, TB/U, BB/TB berdasarkan standar Permenkes.
Dua mode: non‑arsip (hitung langsung, tanpa simpan) dan arsip (catat data diri, edit, ekspor CSV).
Target deployment: GitHub Pages via Next.js static export (`out/`).

## Ownership

- **Project**: status-gizi
- **Stack**: Next.js (App Router), React 18+, Tailwind CSS, IndexedDB (`idb`), papaparse
- **Host**: GitHub Pages (branch `gh-pages`)
- **Docs**: PRD.md (otoritas produk), formula.md (tabel baku), design.md (UI), backend.md (logika kalkulasi)

## Local Contracts

- **Offline‑first is non‑negotiable.** Semua aset, data formula, dan logika harus berjalan tanpa server setelah load pertama. Service worker wajib.
- **Data stays local.** Tidak boleh ada pengiriman data pengguna ke server mana pun.
- **Tiga fase berurutan** (PRD.md §8): Frontend (UI + dummy data) → Backend (logika + unit test) → Integrasi & Deploy. Jangan lompat fase.
- **Acuan wajib**: `formula.md`, `design.md`, `backend.md` adalah spesifikasi yang mengikat. Baca dokumen terkait sebelum menulis kode di domain tersebut.
- **ponytail.md** adalah filosofi pengembangan seluruh proyek. Setiap agent wajib mematuhinya (lihat Work Guidance).

## Work Guidance

Filosofi: **ponytail.md** — lazy senior dev. Efisien, bukan ceroboh.

Tangga keputusan sebelum menulis kode:
1. YAGNI — apakah ini benar perlu?
2. Sudah ada di codebase? Pakai ulang.
3. Standard library menyediakan? Pakai.
4. Platform native feature? Pakai.
5. Dependency yang sudah terinstal? Pakai.
6. Bisa satu baris? Jadikan satu baris.
7. Baru tulis kode minimum yang bekerja.

Aturan:
- Tidak ada abstraksi yang tidak diminta eksplisit.
- Tidak ada dependency baru jika bisa dihindari.
- Tidak ada boilerplate yang tidak diminta.
- Hapus lebih baik daripada tambah. Membosankan lebih baik daripada pintar.
- File sesedikit mungkin. Diff terpendek yang bekerja menang.
- Bug fix = akar masalah, bukan gejala. Grep semua pemanggil fungsi yang disentuh.
- Simplifikasi disengaja ditandai dengan komentar `ponytail:` — sebut batasannya dan jalur upgrade.

Tidak bisa malas untuk: memahami masalah (baca dan telusuri alur sungguhan sebelum memilih anak tangga), validasi input di trust boundary, error handling yang mencegah kehilangan data, keamanan, aksesibilitas.

## Verification

Belum ada framework verifikasi. Update section ini begitu test/check tersedia (target: Jest unit test di Fase 2).

## Child DOX Index

Belum ada child AGENTS.md. Direktori `src/components/`, `src/context/`, `src/lib/` adalah implementasi Fase 1 tanpa batasan scope terpisah.

### Reference Docs
- `PRD.md` — spesifikasi produk, fase pengembangan, kebutuhan fungsional/non‑fungsional
- `ponytail.md` — filosofi pengembangan (dokumen referensi, bukan child scope)
- `dox.md` — deskripsi framework DOX (dokumen referensi, bukan child scope)
- `formula.md` — tabel baku Permenkes untuk BB/U, TB/U, BB/TB (akuan Fase 2)
- `design.md` — panduan UI, warna, layout, komponen (akuan Fase 1, sudah diimplementasi)
- `backend.md` — spesifikasi logika kalkulasi dan format output (akuan Fase 2)

### Implementasi Fase 1: src/
- `src/app/layout.js` — root layout + SW registration
- `src/app/page.js` — halaman utama (single-page, mode diatur toggle TopBar)
- `src/app/globals.css` — Tailwind + CSS variables tema (light/dark)
- `src/components/TopBar.js` — sticky nav: brand, panduan, arsip toggle, tema toggle
- `src/components/MeasurementForm.js` — form input (non-arsip) + form data diri (arsip)
- `src/components/ResultCard.js` — tampil hasil status gizi + Z-score detail
- `src/components/ArchiveList.js` — tabel/kartu catatan + edit/hapus + CSV export
- `src/components/ManualModal.js` — overlay panduan referensi Permenkes
- `src/context/ThemeContext.js` — tema light/dark dengan persistensi localStorage
- `src/context/ArchiveContext.js` — state toggle mode arsip
- `src/lib/calc.js` — engine kalkulasi Z-score berdasarkan tabel Permenkes (formula.md)
- `src/data/reference.js` — tabel referensi WHO/Permenkes (BB/U, TB/U, BB/TB, IMT/U)
- `src/lib/dummyData.js` — dummy kalkulasi (Fase 1, legacy — gunakan calc.js untuk Fase 2+)
- `src/lib/db.js` — IndexedDB wrapper (idb) untuk CRUD catatan
- `src/lib/csv.js` — ekspor CSV via papaparse

### Assets
- `public/manifest.json` — PWA manifest
- `public/sw.js` — service worker cache-first untuk offline

Child scope (AGENTS.md baru) akan dibuat jika subdirektori mendapat batasan scope yang jelas pada Fase 2/3.
