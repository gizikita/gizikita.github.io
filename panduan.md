# Panduan Operasional GiziKita

## Kalkulator Status Gizi Balita & Anak 0–60 Bulan

Berdasarkan Standar Antropometri Anak — Permenkes No. 2 Tahun 2020

---

## Daftar Isi

1. Pendahuluan
2. Akses Aplikasi
3. Mode Perhitungan Cepat (Non-Arsip)
4. Empat Indeks Antropometri
5. Mode Arsip (Pencatatan Data)
6. Impor Data dari Excel / CSV
7. Ekspor Data ke XLSX
8. Template Impor
9. Manajemen Data
10. Pengaturan Tampilan
11. Pemecahan Masalah
12. Referensi

---

## 1. Pendahuluan

**GiziKita** adalah aplikasi web offline-first untuk menghitung status gizi
balita dan anak usia 0–60 bulan berdasarkan Standar Antropometri Anak
(Permenkes No. 2 Tahun 2020). Aplikasi ini bekerja 100% di browser tanpa
perlu koneksi internet setelah pertama kali dimuat.

### Fitur Utama

- **4 indeks antropometri**: BB/U, TB/U, BB/TB, IMT/U
- **Dua mode**: hitung cepat (non-arsip) dan pencatatan data (arsip)
- **Impor data** dari file Excel (.xlsx) dan CSV
- **Ekspor data** ke XLSX dengan warna status
- **Tema** terang dan gelap
- **Offline** — service worker cache-first
- **Responsif** — mobile dan desktop

### Target Pengguna

- Kader posyandu
- Tenaga kesehatan (bidan, perawat, gizi)
- Orang tua yang ingin memantau tumbuh kembang anak

---

## 2. Akses Aplikasi

Aplikasi dapat diakses melalui browser di alamat:

**https://gizikita.github.io**

*Tidak perlu instalasi — buka URL dan aplikasi siap digunakan.*

Untuk penggunaan offline:
1. Buka aplikasi saat online (pertama kali).
2. Service worker akan menyimpan semua aset.
3. Kunjungan berikutnya tetap berfungsi tanpa internet.

---

## 3. Mode Perhitungan Cepat (Non-Arsip)

Mode ini digunakan untuk menghitung status gizi tanpa menyimpan data.

### Langkah-langkah:

1. **Pilih indeks** — klik tombol Ringkasan, BB/U, TB/U, BB/TB, atau IMT/U
   di bawah judul aplikasi.

2. **Masukkan usia** — pilih antara:
   - *Tanggal Lahir*: pilih tanggal lahir anak (usia dihitung otomatis)
   - *Usia (bulan)*: masukkan langsung usia dalam bulan (0–60)

3. **Pilih jenis kelamin** — Laki-laki atau Perempuan.

4. **Masukkan pengukuran** — tergantung indeks yang dipilih:
   - BB/U: hanya berat badan (kg)
   - TB/U: hanya tinggi badan (cm)
   - BB/TB: berat badan + tinggi badan
   - IMT/U: berat badan + tinggi badan
   - Ringkasan: semua field

5. **Klik "Hitung"** — hasil akan muncul dalam bentuk kartu dengan:
   - Status gizi utama (berdasarkan BB/TB)
   - Z-score per indeks
   - Kategori status per indeks

---

## 4. Empat Indeks Antropometri

### BB/U — Berat Badan menurut Umur

| Kategori | Ambang Batas Z-Score |
|---|---|
| Berat Badan Sangat Kurang | < -3 SD |
| Berat Badan Kurang | -3 SD s/d < -2 SD |
| Berat Badan Normal | -2 SD s/d +1 SD |
| Risiko Berat Badan Lebih | > +1 SD |

### TB/U — Tinggi Badan menurut Umur

| Kategori | Ambang Batas Z-Score |
|---|---|
| Sangat Pendek | < -3 SD |
| Pendek | -3 SD s/d < -2 SD |
| Normal | -2 SD s/d +3 SD |
| Tinggi | > +3 SD |

### BB/TB — Berat Badan menurut Tinggi Badan

| Kategori | Ambang Batas Z-Score |
|---|---|
| Gizi Buruk | < -3 SD |
| Gizi Kurang | -3 SD s/d < -2 SD |
| Gizi Baik (Normal) | -2 SD s/d +1 SD |
| Berisiko Gizi Lebih | > +1 SD s/d +2 SD |
| Gizi Lebih | > +2 SD s/d +3 SD |
| Obesitas | > +3 SD |

### IMT/U — Indeks Massa Tubuh menurut Umur

Kategori dan ambang batas sama dengan BB/TB.

Setiap indeks memiliki **kategori warna** yang berbeda pada hasil:
- **Hijau**: status normal/baik
- **Kuning**: peringatan (kurang, risiko lebih)
- **Merah**: bahaya (buruk, obesitas, sangat pendek)
- **Biru**: kategori khusus (tinggi)

---

## 5. Mode Arsip (Pencatatan Data)

Mode arsip memungkinkan pencatatan dan penyimpanan data anak secara lokal
di browser (IndexedDB).

### Mengaktifkan Mode Arsip

Klik tombol **Arsip** (berbentuk chip dengan ikon folder) di pojok kanan
atas. Saat aktif, chip akan berwarna hijau tosca.

### Form Data Anak

Setelah mode arsip aktif, form akan menampilkan field tambahan:

- **Nama Anak** (wajib)
- **Tanggal Lahir** atau **Usia (bulan)**
- **Jenis Kelamin** (wajib)
- **Nama Orang Tua** (opsional)
- **Alamat** (opsional)
- **Tanggal Pengukuran**

### Menyimpan Data

1. Isi form lengkap.
2. Klik **"Simpan & Hitung"**.
3. Data akan tersimpan dan hasil kalkulasi langsung tampil.
4. Notifikasi "Data tersimpan" muncul di pojok kanan bawah.

### Mengedit Data

1. Klik tombol **Edit** pada catatan yang ingin diubah.
2. Form akan terisi dengan data yang tersimpan.
3. Ubah data yang diperlukan.
4. Klik **"Perbarui"** untuk menyimpan perubahan.

### Menghapus Data

1. Klik tombol **Hapus** pada catatan.
2. Konfirmasi dengan dialog "Hapus catatan?".
3. Data akan dihapus permanen.

### Menghapus Semua Data

1. Klik tombol **Hapus Semua** (border merah).
2. Konfirmasi dengan dialog konfirmasi.
3. Semua catatan akan dihapus.

---

## 6. Impor Data dari Excel / CSV

GiziKita mendukung impor data dari file Excel (.xlsx) dan CSV.

### Format File

File harus memiliki kolom dengan header yang dikenali, seperti:

| Kolom | Contoh | Keyword yang dikenali |
|---|---|---|
| Nama Anak | BUDI SANTOSO | nama, nama anak |
| JK | L atau P | jk, jenis kelamin |
| Tanggal Lahir | 15/01/2023 | tgl lahir |
| Berat Badan | 8.5 kg | bb, berat badan |
| Tinggi Badan | 65 cm | tb, tinggi badan |
| Tanggal Ukur | 01/07/2026 | tgl ukur |
| Nama Orang Tua | SARI | nama orang tua |
| Alamat | JL. MERPATI | alamat |

*Nama akan otomatis diubah menjadi HURUF KAPITAL.*

### Cara Impor

1. Aktifkan mode **Arsip**.
2. Klik tombol **Import** (ikon panah atas).
3. Pilih file Excel atau CSV.
4. Tunggu proses parsing — notifikasi "Membaca file..." akan muncul.
5. Setelah selesai, notifikasi akan menampilkan jumlah data yang berhasil
   diimpor dan yang dilewati (duplikat).
6. Data yang tidak memiliki pengukuran BB/TB akan tercatat sebagai
   **"Tidak Ada Data"**.

### Duplikat

Sistem akan mendeteksi duplikat berdasarkan **nama + tanggal lahir**.
Data duplikat akan dilewati dan dilaporkan di notifikasi.

---

## 7. Ekspor Data ke XLSX

Semua catatan dapat diekspor ke file Excel (.xlsx) dengan **warna latar
sel** yang menunjukkan status gizi.

### Cara Ekspor

1. Pastikan mode **Arsip** aktif dan ada data tersimpan.
2. Klik tombol **XLSX** (border hijau).
3. File `gizikita-data.xlsx` akan terunduh.

### Warna Status di Excel

| Status | Warna Sel |
|---|---|
| Gizi Baik / Normal | Hijau muda (#C8E6C9) |
| Gizi Kurang / Berisiko | Kuning (#FFF9C4) |
| Gizi Buruk / Obesitas | Merah muda (#FFCDD2) |
| Sangat Pendek | Merah muda (#FFCDD2) |
| Pendek | Kuning (#FFF9C4) |
| Tinggi | Biru muda (#BBDEFB) |
| Tidak Ada Data | Abu-abu (#E0E0E0) |

---

## 8. Template Impor

Sebelum mengimpor data, disarankan mengunduh **Template** terlebih dahulu.

1. Klik tombol **Template** (ikon dokumen).
2. File `template-impor-gizikita.csv` akan terunduh.
3. Isi data sesuai contoh pada baris pertama.
4. Simpan sebagai CSV.
5. Import file tersebut melalui tombol **Import**.

### Kolom Template

- Nama
- JK (L atau P)
- Tgl Lahir (YYYY-MM-DD atau DD/MM/YYYY)
- Tgl Ukur
- BB (kg)
- TB (cm)
- Status
- Nama Orang Tua
- Alamat

*Baris contoh dapat dihapus sebelum impor.*

---

## 9. Manajemen Data

### Penyimpanan

Semua data disimpan di **IndexedDB** browser (penyimpanan lokal).
Data **tidak dikirim** ke server mana pun — 100% privat.

### Kapasitas

IndexedDB memiliki kapasitas yang cukup besar (hingga 60% dari ruang
disk). Untuk keamanan, disarankan:

- Ekspor data secara rutin melalui tombol XLSX.
- Hapus data yang sudah tidak diperlukan.

### Hapus Semua Data

Tombol **Hapus Semua** (border merah dengan ikon tempat sampah) akan
menghapus seluruh catatan yang tersimpan. Konfirmasi diperlukan sebelum
penghapusan.

---

## 10. Pengaturan Tampilan

### Tema Terang / Gelap

Klik ikon bulan/matahari di pojok kanan atas untuk mengganti tema.
Pilihan tema akan tersimpan untuk kunjungan berikutnya.

### Pemilih Indeks

Di bawah judul aplikasi, terdapat deretan tombol untuk memilih indeks:

- **Ringkasan** — menampilkan semua indeks sekaligus
- **BB/U** — fokus pada Berat Badan menurut Umur
- **TB/U** — fokus pada Tinggi Badan menurut Umur
- **BB/TB** — fokus pada Berat Badan menurut Tinggi Badan
- **IMT/U** — fokus pada Indeks Massa Tubuh menurut Umur

Pemilihan indeks juga akan menyesuaikan **form input** yang ditampilkan.
Misalnya, jika memilih BB/U, form hanya akan menampilkan field berat
badan.

### Tombol Panduan Data

Klik ikon buku di pojok kanan atas untuk melihat panduan singkat
kategori status gizi berdasarkan Permenkes.

---

## 11. Pemecahan Masalah

### Tanggal tidak terbaca (NaN atau undefined)

Pastikan format tanggal yang digunakan:
- `DD/MM/YYYY` (contoh: 15/01/2023)
- `DD-MM-YYYY`
- `DD.MM.YYYY`
- `YYYY-MM-DD`

### Data tidak muncul setelah impor

1. Periksa format file — pastikan menggunakan CSV atau XLSX.
2. Pastikan ada kolom dengan header yang dikenali (Nama, BB, TB, dll).
3. Cek notifikasi — mungkin data terdeteksi sebagai duplikat.

### Kalkulasi tidak berjalan

Pastikan:
- Usia dalam rentang 0–60 bulan.
- Berat badan dan tinggi badan diisi dengan benar.
- Jenis kelamin dipilih.

### Aplikasi tidak bisa offline

Pastikan aplikasi sudah dimuat **saat online** setidaknya satu kali.
Service worker akan menyimpan aset yang diperlukan.

---

## 12. Referensi

- **Permenkes No. 2 Tahun 2020** tentang Standar Antropometri Anak
- **WHO Child Growth Standards** untuk anak usia 0–5 tahun
- **WHO Reference 2007** untuk anak usia 5–18 tahun
- **Kode sumber**: https://github.com/gizikita/gizikita
- **Aplikasi**: https://gizikita.github.io

---

*Panduan Operasional GiziKita v1.0 — Juli 2026*
*Dokumen ini dapat diperbanyak untuk keperluan非 komersial.*
