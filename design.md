# Design.md – UI/UX Spesifikasi Website StatusGiziKu

**Dokumen:** Design Reference  
**Versi:** 1.0  
**Tanggal:** 30 Juni 2026  
**Terkait:** PRD StatusGiziKu, formula.md, backend.md

---

## 1. Gambaran Umum

Website dirancang **sangat ringan** agar tetap responsif di jaringan lambat maupun offline. Tampilan bersih, fokus pada fungsionalitas, dengan dukungan penuh **Light Mode** dan **Dark Mode**.  
Antarmuka terdiri dari **Topbar** sebagai navigasi utama dan **Konten Utama** yang dinamis berdasarkan mode **Arsip (Archive)**.

---

## 2. Prinsip Desain

- **Minimalis & Fungsional:** Tidak ada elemen dekoratif berlebihan; setiap komponen punya tujuan jelas.
- **Kontras Tinggi:** Memudahkan pembacaan di luar ruangan (posyandu).  
- **Mobile‑First:** Layout dioptimasi untuk layar kecil (360px) dengan perluasan mulus ke desktop.
- **Transisi Halus:** Perpindahan tema dan mode arsip menggunakan transisi CSS ringan (0.2–0.3s).
- **Offline‑Ready:** Tidak bergantung pada ikon/CDN eksternal; ikon lokal atau inline SVG.

---

## 3. Skema Warna

### Light Mode
| Peran          | Warna (Hex)  | Keteratan                     |
|----------------|--------------|-------------------------------|
| Latar Utama    | `#F9FAFB`    | Abu‑putih sangat muda         |
| Permukaan Kartu| `#FFFFFF`    | Putih, bayangan halus         |
| Teks Utama     | `#111827`    | Abu‑gelap                     |
| Teks Sekunder  | `#6B7280`    | Abu‑sedang                    |
| Aksen Utama    | `#059669`    | Hijau (medis/sehat)           |
| Aksen Bahaya   | `#DC2626`    | Merah (peringatan)            |
| Batas (Border) | `#E5E7EB`    | Abu‑muda                      |

### Dark Mode
| Peran          | Warna (Hex)  | Keteratan                     |
|----------------|--------------|-------------------------------|
| Latar Utama    | `#0F172A`    | Biru‑gelap pekat              |
| Permukaan Kartu| `#1E293B`    | Biru‑gelap                    |
| Teks Utama     | `#F1F5F9`    | Putih‑kebiruan                |
| Teks Sekunder  | `#94A3B8`    | Abu‑biru                      |
| Aksen Utama    | `#10B981`    | Hijau‑terang (disesuaikan)    |
| Aksen Bahaya   | `#EF4444`    | Merah‑terang                  |
| Batas (Border) | `#334155`    | Biru‑gelap                    |

> Catatan: Semua warna didefinisikan sebagai CSS custom properties (variabel) untuk kemudahan tema.

---

## 4. Tipografi

- **Font Utama:** `Inter` (sans‑serif), di‑*self‑host* untuk performa offline.  
- **Fallback:** `system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial`.  
- **Skala:**  
  - Judul halaman: 1.5rem (mobile) / 2rem (desktop), tebal 600.  
  - Label form: 0.875rem, tebal 500.  
  - Input teks: 1rem.  
  - Tombol: 0.875rem, tebal 500, huruf kapital (opsional).

---

## 5. Layout & Topbar

Topbar selalu terlihat di bagian atas, **sticky** (posisi tetap saat scroll).  

**Komponen Topbar:**
1. **Ikon + Judul Aplikasi** (kiri)  
   - Ikon: siluet anak/timbangan (SVG inline), ukuran 24x24px.  
   - Teks: “StatusGiziKu”, warna aksen, tebal.
2. **Tombol Manual Data**  
   - Ikon buku/bantuan “?”, label “Panduan Data”.  
   - Saat diklik: modal/layar penuh menampilkan referensi ringkas dari `formula.md`.
3. **Switch Mode Arsip**  
   - Toggle switch dengan label “Mode Arsip”.  
   - Status aktif: latar belakang aksen hijau; nonaktif: abu‑abu.  
   - Animasi geser halus.
4. **Tombol Tema (Light/Dark)**  
   - Ikon matahari (☀️) / bulan (🌙), ukuran 20px.  
   - Berganti ikon sesuai tema aktif.

**Susunan (mobile):**  
`[Ikon+Judul] ... [Buku] [Switch Arsip] [Tema]`  
Gunakan flexbox, ruang otomatis di antara kiri dan kanan.

**Susunan (desktop):**  
Lebar maksimal konten 1200px, topbar memanjang penuh. Komponen tetap berderet seperti mobile namun dengan padding lebih besar.

---

## 6. Konten Utama – Berdasarkan Mode Arsip

Area di bawah topbar menampilkan formulir dan hasil.

### 6.1 Mode Arsip NONAKTIF (hanya input pengukuran)

Tampilan berupa **satu kartu** berisi:
- **Form Pengukuran:**
  - Jenis Kelamin: radio button (Laki‑laki / Perempuan) – tampil sebagai pilihan kotak.
  - Usia: input angka (bulan) atau pilihan bulan+tahun (dropdown kecil untuk tahun, input bulan). Default: input bulan.
  - Berat Badan (kg): input angka dengan step 0.1.
  - Tinggi Badan (cm): input angka dengan step 0.1.
- **Tombol Hitung** (warna aksen penuh, lebar penuh di mobile, lebar tetap di desktop).
- **Area Hasil:** setelah dihitung, muncul di bawah tombol atau kartu baru. Menampilkan:
  - Status Gizi (label besar), misal “Gizi Baik” dengan warna indikator (hijau/merah/kuning).
  - Detail Z‑score BB/U, TB/U, BB/TB (jika tersedia).

Tidak ada penyimpanan data.

### 6.2 Mode Arsip AKTIF (tambah pencatatan data diri)

Tampilan **dua bagian**:

**a) Formulir Data Diri + Pengukuran** (kartu atas)
- Sama seperti mode non‑arsip, namun **sebelum** input pengukuran terdapat:
  - Nama Anak (teks)
  - Tanggal Lahir (date picker native)
  - Jenis Kelamin (radio, bisa diisi otomatis dari input pengukuran jika diinginkan)
  - Nama Orang Tua (teks, opsional)
  - Alamat (textarea kecil)
- Input pengukuran tetap sama, namun tanggal pengukuran default hari ini, dapat diubah.
- Tombol **Simpan & Hitung** (warna aksen) – menyimpan data ke penyimpanan lokal sekaligus menampilkan hasil.

**b) Daftar Catatan Tersimpan** (kartu bawah atau di bawah formulir)
- Tabel responsif dengan kolom: Nama, Umur (otomatis dari tgl lahir), BB, TB, Status, Aksi.
- Di mobile: tampil sebagai daftar kartu vertikal, setiap kartu menampilkan info dan tombol Edit/Hapus.
- Tombol **Unduh CSV** di bagian atas tabel (warna sekunder, ikon unduh).
- Fungsi Edit: klik baris/kartu → isi formulir di atas dengan data tersebut, tombol berubah menjadi “Perbarui”.
- Fungsi Hapus: konfirmasi singkat (modal kecil).

---

## 7. Tombol Manual Data (Referensi formula.md)

- Saat ditekan, muncul **modal overlay** dengan latar belakang semi‑transparan gelap.
- Modal berisi konten markdown yang dirender menjadi HTML sederhana (tabel z‑score ringkas, bukan seluruh formula.md, cukup panduan singkat dengan catatan “untuk detail lengkap lihat dokumen asli”).
- Tombol “Tutup” di sudut kanan atas modal (ikon ×).
- Scrollable jika konten panjang.

---

## 8. Responsivitas & Breakpoint

| Breakpoint        | Layout                                                   |
|-------------------|----------------------------------------------------------|
| < 640px (mobile)  | Topbar: ikon kecil, label opsional disembunyikan? (tetap tampil "Panduan" bisa teks pendek). Form dalam satu kolom, kartu penuh lebar. Daftar arsip menjadi daftar kartu. |
| 640–1024px (tablet)| Topbar tetap satu baris. Form dapat dua kolom (label kiri, input kanan). Tabel mulai muncul. |
| > 1024px (desktop) | Konten dibatasi lebar 960px di tengah. Form dua kolom. Tabel penuh. |

---

## 9. Status & Umpan Balik

- **Loading:** ikon spinner kecil inline saat kalkulasi (meskipun kalkulasi klien hampir instan, sebagai indikator proses).
- **Error Validasi:** border input berubah merah, teks pesan kecil di bawah input.
- **Sukses Simpan:** notifikasi toast kecil di pojok bawah (warna hijau) “Data tersimpan”.
- **Data Kosong (Arsip):** ilustrasi ringan atau teks “Belum ada data tersimpan”.

---

## 10. Komponen Utama (Ringkasan)

1. **TopBar**  
   - Props: `theme`, `onToggleTheme`, `archiveMode`, `onToggleArchive`, `onOpenManual`.  
2. **MeasurementForm**  
   - Props: `mode` (archive/non‑archive), `initialData?`, `onSubmit`.  
   - Menangani input pengukuran & data diri jika mode arsip.  
3. **ResultCard**  
   - Props: `statusGizi`, `zScores`.  
4. **ArchiveList** (hanya jika mode arsip)  
   - Props: `records`, `onEdit`, `onDelete`.  
   - Menampilkan tabel/kartu, dengan fitur pengurutan.  
5. **ManualModal**  
   - Menampilkan cuplikan `formula.md`.  
6. **ThemeToggle, ArchiveSwitch** – komponen kecil.  

---

## 11. Navigasi & Alur Pengguna

1. Buka situs → tampil mode non‑arsip, light mode default.  
2. (Opsional) Ganti ke dark mode.  
3. Isi form pengukuran → hitung → lihat hasil.  
4. (Jika perlu catat) Aktifkan switch mode arsip → form data diri muncul.  
   - Isi data → simpan → muncul di daftar.  
   - Edit/hapus data dari daftar.  
5. Klik “Panduan Data” untuk melihat referensi standar Permenkes.  
6. Unduh CSV kapan pun saat di mode arsip.

---

## 12. Panduan Implementasi

- Gunakan CSS Modules atau Tailwind dengan dukungan tema `data-theme="dark"`.
- Jangan gunakan pustaka ikon berat; buat SVG sederhana.
- Pastikan semua aset (font, SVG) disertakan dalam service worker cache.
- Transisi tema & mode arsip mengandalkan CSS `transition` pada `background-color` dan `color`.
- Form validasi menggunakan constraint validation API bawaan browser.

---

**Dokumen ini wajib diacu oleh pengembang frontend pada Fase 1.**  
Revisi akan dilakukan jika ada perubahan signifikan dari `design.md` ini.