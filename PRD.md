# PRD: Website Kalkulator Status Gizi (Offline-First)

**Nama Proyek:** StatusGiziKu  
**Versi Dokumen:** 1.0  
**Tanggal:** 30 Juni 2026  
**Penulis:** [Nama Anda]  
**Deployment Target:** GitHub Pages (Next.js static export)

---

## 1. Ringkasan Eksekutif

Website ini digunakan untuk menghitung status gizi balita dan anak berdasarkan standar **Permenkes (formula.md)**. Website bekerja secara **offline** (setelah pertama kali dimuat) sehingga dapat diakses di lapangan tanpa koneksi internet.  
Aplikasi memiliki dua **mode utama**:

- **Mode non‑arsip**: kalkulasi status gizi langsung tanpa menyimpan data.
- **Mode arsip**: kalkulasi disertai pencatatan data diri, edit daftar catatan, dan ekspor hasil ke CSV.

Website dibangun dengan **Next.js + React**, diekspor secara statis, dan di‑host di **GitHub Pages**.

---

## 2. Tujuan Proyek

- Menyediakan alat hitung status gizi (BB/U, TB/U, BB/TB) yang **sesuai Permenkes**.
- Bekerja **100% offline** untuk digunakan di posyandu/daerah minim sinyal.
- Merekam data balita secara lokal (browser storage) pada mode arsip.
- Memudahkan petugas mengunduh data rekaman dalam format **CSV**.
- Dokumentasi pengembangan terstruktur dengan referensi `design.md`, `backend.md`, `formula.md`, dan `agents.md`.

---

## 3. Lingkup & Fitur

### 3.1 Fitur Mode Non‑Arsip (Langsung)
- Form input: jenis kelamin, usia (bulan/tahun), berat badan (kg), tinggi badan (cm).
- Tombol **Hitung** → menampilkan:
  - Z‑score atau ambang batas (sesuai Permenkes).
  - Kategori status gizi: Gizi Buruk, Gizi Kurang, Gizi Baik, Gizi Lebih, Obesitas.
- Hasil tidak disimpan.

### 3.2 Fitur Mode Arsip (Dengan Pencatatan)
- Form data diri: nama, tanggal lahir, jenis kelamin, nama orang tua, alamat (minimal).
- Input pengukuran: berat, tinggi, tanggal pengukuran.
- Daftar catatan tersimpan (tabel/list) di halaman yang sama.
- **Edit** data yang sudah tersimpan (inline atau modal).
- **Hapus** catatan.
- **Download CSV** seluruh catatan yang tersimpan.
- Data disimpan di **localStorage / IndexedDB** (pilihan browser).

### 3.3 Fitur Umum
- UI responsif (mobile‑first).
- PWA basic: service worker untuk cache aset, memungkinkan akses offline sempurna.
- Tidak memerlukan backend server; semua logika dijalankan di browser.

---

## 4. Kebutuhan Fungsional

| ID     | Fungsi                                                                                           |
|--------|--------------------------------------------------------------------------------------------------|
| FR‑01  | Membaca data baku dari `formula.md` yang telah dikonversi menjadi struktur JSON/JS.               |
| FR‑02  | Menampilkan form perhitungan dengan validasi input (angka, rentang usia 0‑60 bulan).              |
| FR‑03  | Menghitung status gizi berdasarkan data input dan standar Permenkes.                              |
| FR‑04  | Menampilkan hasil kalkulasi (nilai z‑score, status gizi) secara real‑time setelah submit.         |
| FR‑05  | Menyediakan mode arsip: form data diri + pengukuran.                                              |
| FR‑06  | Menyimpan catatan ke penyimpanan lokal (localStorage/IndexedDB) pada mode arsip.                  |
| FR‑07  | Menampilkan daftar catatan yang tersimpan, mendukung pengurutan berdasarkan tanggal/waktu.        |
| FR‑08  | Fitur edit data catatan yang tersimpan.                                                           |
| FR‑09  | Fitur hapus catatan dengan konfirmasi.                                                            |
| FR‑10  | Ekspor daftar catatan ke file CSV (format kolom: Nama, JK, Tgl Lahir, Tgl Ukur, BB, TB, Status). |
| FR‑11  | Bekerja offline setelah aset dan data formula di‑cache.                                          |

---

## 5. Kebutuhan Non‑Fungsional

- **Offline‑first**: service worker harus mencache seluruh HTML, CSS, JS, dan data formula.
- **Performa**: waktu hitung < 100 ms untuk input biasa.
- **Kompatibilitas**: browser modern (Chrome, Firefox, Edge, Safari mobile).
- **Keamanan data**: data disimpan lokal, tidak dikirim ke server mana pun.
- **Kemudahan deploy**: generate folder `out/` dari Next.js, langsung push ke branch `gh-pages`.

---

## 6. Arsitektur Teknis

- **Frontend**: Next.js (App Router atau Pages Router) + React 18+.
- **Styling**: Tailwind CSS / CSS Modules (mengacu `design.md`).
- **State Management**: React Context + useReducer (jika diperlukan).
- **Penyimpanan lokal**: 
  - Data formula: file JavaScript statis hasil konversi `formula.md`.
  - Data arsip: IndexedDB via library `idb` (untuk performa dan kapasitas lebih baik).
- **CSV Export**: library `papaparse`.
- **Deployment**: GitHub Actions build → output folder `out` → deploy ke GitHub Pages.

---

## 7. Referensi Dokumen Pendukung

Pengembangan **harus merujuk** pada dokumen‑dokumen berikut:

- **formula.md** – berisi tabel baku Permenkes (BB/U, TB/U, BB/TB) yang menjadi sumber logika perhitungan.
- **design.md** – panduan tampilan antarmuka (warna, layout, komponen) untuk frontend.
- **backend.md** – spesifikasi logika perhitungan status gizi (fungsi, parameter, format output) yang harus diimplementasikan pada tahap backend.
- **agents.md** – petunjuk pemanfaatan agen AI untuk membantu penulisan kode, testing, dan dokumentasi.

> Catatan: Seluruh referensi ini akan digunakan sebagai acuan wajib pada setiap tahapan.

---

## 8. Fase Pengembangan

Pengerjaan dibagi menjadi **tiga tahap** utama:

### 8.1 Fase 1 – Frontend (UI & Interaksi)
**Acuan utama:** `design.md`  
**Tugas:**
1. Setup project Next.js, routing, dan layout dasar.
2. Membangun komponen form perhitungan (input‑output).
3. Membangun komponen mode arsip: form data diri, tabel daftar catatan.
4. Menerapkan validasi input dan feedback pengguna.
5. Styling sesuai `design.md`, termasuk responsivitas.
6. Implementasi dummy data untuk simulasi perhitungan (tanpa logika nyata).
7. Integrasi library CSV (export dummy data).

**Keluaran:** Antarmuka lengkap dengan data dummy, siap diintegrasikan dengan modul backend.

### 8.2 Fase 2 – Backend (Logika Kalkulasi)
**Acuan utama:** `backend.md` dan `formula.md`  
**Tugas:**
1. Konversi `formula.md` menjadi struktur data terstruktur (file JSON/JavaScript) yang berisi tabel z‑score per indeks antropometri.
2. Mengimplementasikan fungsi kalkulasi sesuai spesifikasi di `backend.md`:
   - Fungsi hitungZScore(umur, jenisKelamin, berat, tinggi) → mengembalikan status gizi.
   - Menangani rentang umur, interpolasi jika diperlukan.
3. Unit test untuk fungsi kalkulasi (Jest) dengan kasus uji dari data sampel.
4. Membuat modul yang siap diimpor oleh frontend.

**Keluaran:** Modul JavaScript mandiri yang dapat mengembalikan hasil status gizi tanpa dependensi runtime.

### 8.3 Fase 3 – Integrasi & Deployment
**Tugas:**
1. Menggabungkan antarmuka frontend dengan modul backend.
2. Menghubungkan form input dengan fungsi kalkulasi.
3. Mengaktifkan penyimpanan nyata di IndexedDB untuk mode arsip.
4. Pengujian end‑to‑end (manual) di berbagai browser.
5. Konfigurasi service worker (next‑pwa atau workbox) untuk caching offline.
6. Setup GitHub Actions untuk build & deploy ke GitHub Pages.
7. Dokumentasi penggunaan.

**Keluaran:** Aplikasi siap pakai yang dapat diakses melalui URL GitHub Pages.

---

## 9. Pelacakan (Tracking) Saran & Masukan

Selama pengembangan, **saran dan masukan (saranku)** akan dicatat dan ditindaklanjuti.  
Mekanisme pelacakan:

- Setiap saran diberi ID dan dicatat di *issue tracker* repositori GitHub.
- Label: `saran`, `prioritas`, `frontend`, `backend`.
- Implementasi saran akan diverifikasi pada tahap integrasi.

---

## 10. Kriteria Penerimaan (DoD)

- [ ] Aplikasi dapat diakses melalui browser tanpa koneksi internet (setelah loading pertama).
- [ ] Kalkulasi status gizi mengembalikan hasil yang sesuai dengan contoh di `formula.md`.
- [ ] Mode arsip dapat menyimpan, mengedit, menghapus, dan meng‑ekspor CSV.
- [ ] Tampilan sesuai `design.md` pada mobile dan desktop.
- [ ] Tidak ada error pada console saat penggunaan umum.
- [ ] Berhasil di‑deploy ke GitHub Pages.

---

## 11. Risiko & Asumsi

- Asumsi: `formula.md` memuat semua data yang diperlukan (BB/U, TB/U, BB/TB) dalam rentang umur 0‑60 bulan.
- Risiko: Browser menghapus data lokal jika kuota penyimpanan penuh → mitigasi: beri peringatan dan sarankan ekspor rutin.
- Risiko: Perubahan standar Permenkes → data formula harus diperbarui di `formula.md` lalu dikonversi ulang.

---

## 12. Glosarium

| Istilah       | Keterangan                                                            |
|---------------|-----------------------------------------------------------------------|
| BB/U          | Berat Badan menurut Umur                                              |
| TB/U          | Tinggi Badan menurut Umur                                             |
| BB/TB         | Berat Badan menurut Tinggi Badan                                      |
| Z‑score       | Skor simpangan baku dari median populasi referensi                   |
| Status Gizi   | Kategori: Gizi Buruk, Gizi Kurang, Gizi Baik, Gizi Lebih, Obesitas    |

---

**Dokumen ini akan digunakan sebagai pedoman utama pengembangan.**  
Semua perubahan harus diperbarui dan disetujui melalui revisi dokumen ini.