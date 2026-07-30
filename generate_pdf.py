#!/usr/bin/env python3
"""Generate GiziKita operational guide PDF with screenshots."""

from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm, cm
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Image, PageBreak,
    Table, TableStyle, KeepTogether
)
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_JUSTIFY

WIDTH, HEIGHT = A4
OUTPUT = "GiziKita_Panduan_Operasional.pdf"

doc = SimpleDocTemplate(
    OUTPUT,
    pagesize=A4,
    leftMargin=2*cm, rightMargin=2*cm,
    topMargin=2*cm, bottomMargin=2*cm,
)

styles = getSampleStyleSheet()

# Custom styles
title_style = ParagraphStyle('TitleBig', parent=styles['Title'], fontSize=26, leading=32, spaceAfter=6, alignment=TA_CENTER)
subtitle_style = ParagraphStyle('SubTitle', parent=styles['Normal'], fontSize=14, leading=18, spaceAfter=4, alignment=TA_CENTER)
heading1 = ParagraphStyle('H1', parent=styles['Heading1'], fontSize=18, leading=22, spaceBefore=16, spaceAfter=8, textColor=colors.HexColor('#006B5C'))
heading2 = ParagraphStyle('H2', parent=styles['Heading2'], fontSize=14, leading=18, spaceBefore=12, spaceAfter=6, textColor=colors.HexColor('#006B5C'))
body = ParagraphStyle('Body', parent=styles['Normal'], fontSize=10, leading=14, spaceAfter=6, alignment=TA_JUSTIFY)
bullet = ParagraphStyle('Bullet', parent=body, leftIndent=20, bulletIndent=10, spaceBefore=2, spaceAfter=2)
caption = ParagraphStyle('Caption', fontSize=8, leading=10, spaceBefore=4, spaceAfter=8, alignment=TA_CENTER, textColor=colors.gray)

def p(text, style=body):
    return Paragraph(text, style)

def img(path, width=480, height=300):
    return Image(path, width=width, height=height)

def heading(text):
    return Paragraph(text, heading1)

def subheading(text):
    return Paragraph(text, heading2)

story = []

# === COVER ===
story.append(Spacer(1, 80))
story.append(p("GiziKita", title_style))
story.append(p("Panduan Operasional", subtitle_style))
story.append(Spacer(1, 20))
story.append(p("Kalkulator Status Gizi Balita &amp; Anak 0–60 Bulan", ParagraphStyle('Sub2', parent=subtitle_style, fontSize=12)))
story.append(Spacer(1, 10))
story.append(p("Berdasarkan Standar Antropometri Anak — Permenkes No. 2 Tahun 2020", ParagraphStyle('Sub3', parent=subtitle_style, fontSize=10)))
story.append(Spacer(1, 40))
story.append(p("Versi 1.0 — Juli 2026", ParagraphStyle('Version', parent=body, alignment=TA_CENTER, fontSize=11)))
story.append(PageBreak())

# === TABLE OF CONTENTS ===
story.append(heading("Daftar Isi"))
story.append(p("1. Pendahuluan"))
story.append(p("2. Akses Aplikasi"))
story.append(p("3. Mode Perhitungan Cepat (Non-Arsip)"))
story.append(p("4. Empat Indeks Antropometri"))
story.append(p("5. Mode Arsip (Pencatatan Data)"))
story.append(p("6. Impor Data dari Excel / CSV"))
story.append(p("7. Ekspor Data ke XLSX"))
story.append(p("8. Template Impor"))
story.append(p("9. Manajemen Data"))
story.append(p("10. Pengaturan Tampilan"))
story.append(p("11. Pemecahan Masalah"))
story.append(p("12. Referensi"))
story.append(PageBreak())

# === 1. PENDAHULUAN ===
story.append(heading("1. Pendahuluan"))
story.append(p("GiziKita adalah aplikasi web <b>offline-first</b> untuk menghitung status gizi balita dan anak usia 0–60 bulan berdasarkan Standar Antropometri Anak (Permenkes No. 2 Tahun 2020). Aplikasi ini bekerja 100% di browser tanpa perlu koneksi internet setelah pertama kali dimuat."))
story.append(subheading("Fitur Utama"))
story.append(p("• 4 indeks antropometri: BB/U, TB/U, BB/TB, IMT/U"))
story.append(p("• Dua mode: hitung cepat (non-arsip) dan pencatatan data (arsip)"))
story.append(p("• Impor data dari file Excel (.xlsx) dan CSV"))
story.append(p("• Ekspor data ke XLSX dengan warna status"))
story.append(p("• Tema terang dan gelap"))
story.append(p("• Offline — service worker cache-first"))
story.append(p("• Responsif — mobile dan desktop"))
story.append(subheading("Target Pengguna"))
story.append(p("• Kader posyandu"))
story.append(p("• Tenaga kesehatan (bidan, perawat, gizi)"))
story.append(p("• Orang tua yang ingin memantau tumbuh kembang anak"))
story.append(PageBreak())

# === 2. AKSES APLIKASI ===
story.append(heading("2. Akses Aplikasi"))
story.append(p("Aplikasi dapat diakses melalui browser di alamat:"))
story.append(p("<b>https://gizikita.github.io</b>"))
story.append(p("<i>Tidak perlu instalasi — buka URL dan aplikasi siap digunakan.</i>"))
story.append(subheading("Penggunaan Offline"))
story.append(p("1. Buka aplikasi saat online (pertama kali)."))
story.append(p("2. Service worker akan menyimpan semua aset."))
story.append(p("3. Kunjungan berikutnya tetap berfungsi tanpa internet."))
story.append(PageBreak())

# === 3. MODE PERHITUNGAN CEPAT ===
story.append(heading("3. Mode Perhitungan Cepat (Non-Arsip)"))
story.append(p("Mode ini digunakan untuk menghitung status gizi tanpa menyimpan data."))
story.append(subheading("Langkah-langkah:"))
story.append(p("1. <b>Pilih indeks</b> — klik tombol Ringkasan, BB/U, TB/U, BB/TB, atau IMT/U di bawah judul aplikasi."))
story.append(p("2. <b>Masukkan usia</b> — pilih Tanggal Lahir atau Usia (bulan) langsung."))
story.append(p("3. <b>Pilih jenis kelamin</b> — Laki-laki atau Perempuan."))
story.append(p("4. <b>Masukkan pengukuran</b> — tergantung indeks yang dipilih."))
story.append(p("5. <b>Klik Hitung</b> — hasil akan muncul dengan status gizi, Z-score, dan kategori per indeks."))
story.append(Spacer(1, 8))
story.append(p("Tampilan halaman utama dengan hasil kalkulasi:", caption))
story.append(img("public/screenshots/02-hasil.png", width=500, height=320))
story.append(PageBreak())

# === 4. EMPAT INDEKS ===
story.append(heading("4. Empat Indeks Antropometri"))
story.append(subheading("BB/U — Berat Badan menurut Umur"))
data = [['Kategori', 'Ambang Batas Z-Score'],
        ['Berat Badan Sangat Kurang', '< -3 SD'],
        ['Berat Badan Kurang', '-3 SD s/d < -2 SD'],
        ['Berat Badan Normal', '-2 SD s/d +1 SD'],
        ['Risiko Berat Badan Lebih', '> +1 SD']]
t = Table(data, colWidths=[220, 180])
t.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#006B5C')),
    ('TEXTCOLOR', (0,0), (-1,0), colors.white),
    ('FONTSIZE', (0,0), (-1,-1), 9),
    ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#BBC5C0')),
    ('ALIGN', (1,0), (1,-1), 'CENTER'),
    ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ('TOPPADDING', (0,0), (-1,-1), 4),
    ('BOTTOMPADDING', (0,0), (-1,-1), 4),
]))
story.append(t)
story.append(Spacer(1, 10))

story.append(subheading("TB/U — Tinggi Badan menurut Umur"))
data = [['Kategori', 'Ambang Batas Z-Score'],
        ['Sangat Pendek', '< -3 SD'],
        ['Pendek', '-3 SD s/d < -2 SD'],
        ['Normal', '-2 SD s/d +3 SD'],
        ['Tinggi', '> +3 SD']]
t = Table(data, colWidths=[220, 180])
t.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#006B5C')),
    ('TEXTCOLOR', (0,0), (-1,0), colors.white),
    ('FONTSIZE', (0,0), (-1,-1), 9),
    ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#BBC5C0')),
    ('ALIGN', (1,0), (1,-1), 'CENTER'),
    ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ('TOPPADDING', (0,0), (-1,-1), 4),
    ('BOTTOMPADDING', (0,0), (-1,-1), 4),
]))
story.append(t)
story.append(Spacer(1, 10))

story.append(p("Tampilan mode BB/U (hanya field berat badan):", caption))
story.append(img("public/screenshots/03-bbu.png", width=500, height=300))
story.append(Spacer(1, 8))
story.append(p("Tampilan mode TB/U (hanya field tinggi badan):", caption))
story.append(img("public/screenshots/04-tbu.png", width=500, height=300))
story.append(PageBreak())

# === 5. MODE ARSIP ===
story.append(heading("5. Mode Arsip (Pencatatan Data)"))
story.append(p("Mode arsip memungkinkan pencatatan dan penyimpanan data anak secara lokal di browser (IndexedDB)."))
story.append(subheading("Mengaktifkan Mode Arsip"))
story.append(p('Klik tombol <b>Arsip</b> (chip dengan ikon folder) di pojok kanan atas. Saat aktif, chip akan berwarna hijau tosca.'))
story.append(subheading("Form Data Anak"))
story.append(p("• <b>Nama Anak</b> (wajib)"))
story.append(p("• <b>Tanggal Lahir</b> atau <b>Usia (bulan)</b>"))
story.append(p("• <b>Jenis Kelamin</b> (wajib)"))
story.append(p("• <b>Nama Orang Tua</b> (opsional)"))
story.append(p("• <b>Alamat</b> (opsional)"))
story.append(p("• <b>Tanggal Pengukuran</b>"))
story.append(Spacer(1, 8))
story.append(p("Tampilan form mode arsip:", caption))
story.append(img("public/screenshots/07-arsip.png", width=500, height=320))
story.append(Spacer(1, 8))
story.append(p("Tampilan daftar catatan tersimpan:", caption))
story.append(img("public/screenshots/08-arsip-records.png", width=500, height=320))
story.append(PageBreak())

# === 6. IMPOR DATA ===
story.append(heading("6. Impor Data dari Excel / CSV"))
story.append(p("GiziKita mendukung impor data dari file Excel (.xlsx) dan CSV."))
story.append(subheading("Format File"))
story.append(p("File harus memiliki kolom dengan header yang dikenali:"))
data = [['Kolom', 'Contoh', 'Keyword dikenali'],
        ['Nama Anak', 'BUDI SANTOSO', 'nama, nama anak'],
        ['JK', 'L atau P', 'jk, jenis kelamin'],
        ['Tanggal Lahir', '15/01/2023', 'tgl lahir'],
        ['Berat Badan', '8.5', 'bb, berat badan'],
        ['Tinggi Badan', '65', 'tb, tinggi badan'],
        ['Tanggal Ukur', '01/07/2026', 'tgl ukur'],
        ['Nama Orang Tua', 'SARI', 'nama orang tua'],
        ['Alamat', 'JL. MERPATI', 'alamat']]
t = Table(data, colWidths=[100, 100, 130])
t.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#006B5C')),
    ('TEXTCOLOR', (0,0), (-1,0), colors.white),
    ('FONTSIZE', (0,0), (-1,-1), 8),
    ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#BBC5C0')),
    ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ('TOPPADDING', (0,0), (-1,-1), 3),
    ('BOTTOMPADDING', (0,0), (-1,-1), 3),
]))
story.append(t)
story.append(Spacer(1, 6))
story.append(p("<i>Nama akan otomatis diubah menjadi HURUF KAPITAL.</i>"))
story.append(subheading("Cara Impor"))
story.append(p("1. Aktifkan mode <b>Arsip</b>."))
story.append(p("2. Klik tombol <b>Import</b> (ikon panah atas)."))
story.append(p("3. Pilih file Excel atau CSV."))
story.append(p("4. Tunggu proses parsing."))
story.append(p("5. Notifikasi akan menampilkan jumlah data yang berhasil diimpor."))
story.append(p("6. Data tanpa pengukuran BB/TB akan tercatat sebagai <b>Tidak Ada Data</b>."))
story.append(PageBreak())

# === 7. EKSPOR XLSX ===
story.append(heading("7. Ekspor Data ke XLSX"))
story.append(p("Semua catatan dapat diekspor ke file Excel (.xlsx) dengan <b>warna latar sel</b> yang menunjukkan status gizi."))
story.append(subheading("Cara Ekspor"))
story.append(p("1. Pastikan mode <b>Arsip</b> aktif dan ada data tersimpan."))
story.append(p("2. Klik tombol <b>XLSX</b> (border hijau)."))
story.append(p("3. File gizikita-data.xlsx akan terunduh."))
story.append(subheading("Warna Status di Excel"))
data = [['Status', 'Warna Sel'],
        ['Gizi Baik / Normal', 'Hijau muda'],
        ['Gizi Kurang / Berisiko', 'Kuning'],
        ['Gizi Buruk / Obesitas', 'Merah muda'],
        ['Sangat Pendek', 'Merah muda'],
        ['Pendek', 'Kuning'],
        ['Tinggi', 'Biru muda'],
        ['Tidak Ada Data', 'Abu-abu']]
t = Table(data, colWidths=[200, 200])
t.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#006B5C')),
    ('TEXTCOLOR', (0,0), (-1,0), colors.white),
    ('FONTSIZE', (0,0), (-1,-1), 9),
    ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#BBC5C0')),
    ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ('TOPPADDING', (0,0), (-1,-1), 4),
    ('BOTTOMPADDING', (0,0), (-1,-1), 4),
]))
story.append(t)
story.append(PageBreak())

# === 8. TEMPLATE ===
story.append(heading("8. Template Impor"))
story.append(p("Sebelum mengimpor data, disarankan mengunduh <b>Template</b> terlebih dahulu."))
story.append(p("1. Klik tombol <b>Template</b> (ikon dokumen)."))
story.append(p("2. File template-impor-gizikita.csv akan terunduh."))
story.append(p("3. Isi data sesuai contoh pada baris pertama."))
story.append(p("4. Simpan sebagai CSV."))
story.append(p("5. Import file tersebut melalui tombol <b>Import</b>."))
story.append(subheading("Kolom Template"))
story.append(p("• Nama"))
story.append(p("• JK (L atau P)"))
story.append(p("• Tgl Lahir (YYYY-MM-DD atau DD/MM/YYYY)"))
story.append(p("• Tgl Ukur"))
story.append(p("• BB (kg)"))
story.append(p("• TB (cm)"))
story.append(p("• Status"))
story.append(p("• Nama Orang Tua"))
story.append(p("• Alamat"))
story.append(PageBreak())

# === 9. MANAJEMEN DATA ===
story.append(heading("9. Manajemen Data"))
story.append(subheading("Penyimpanan"))
story.append(p("Semua data disimpan di <b>IndexedDB</b> browser (penyimpanan lokal). Data <b>tidak dikirim</b> ke server mana pun — 100% privat."))
story.append(subheading("Kapasitas"))
story.append(p("IndexedDB memiliki kapasitas yang cukup besar (hingga 60% dari ruang disk). Untuk keamanan, disarankan:"))
story.append(p("• Ekspor data secara rutin melalui tombol XLSX."))
story.append(p("• Hapus data yang sudah tidak diperlukan."))
story.append(subheading("Hapus Semua Data"))
story.append(p("Tombol <b>Hapus Semua</b> (border merah) akan menghapus seluruh catatan. Konfirmasi diperlukan."))
story.append(PageBreak())

# === 10. PENGATURAN TAMPILAN ===
story.append(heading("10. Pengaturan Tampilan"))
story.append(subheading("Tema Terang / Gelap"))
story.append(p("Klik ikon bulan/matahari di pojok kanan atas untuk mengganti tema. Pilihan tema akan tersimpan."))
story.append(subheading("Pemilih Indeks"))
story.append(p("Di bawah judul aplikasi, terdapat deretan tombol untuk memilih indeks:"))
story.append(p("• <b>Ringkasan</b> — menampilkan semua indeks"))
story.append(p("• <b>BB/U</b> — Berat Badan menurut Umur"))
story.append(p("• <b>TB/U</b> — Tinggi Badan menurut Umur"))
story.append(p("• <b>BB/TB</b> — Berat Badan menurut Tinggi Badan"))
story.append(p("• <b>IMT/U</b> — Indeks Massa Tubuh menurut Umur"))
story.append(p("Pemilihan indeks juga menyesuaikan form input — misalnya BB/U hanya menampilkan field berat badan."))
story.append(subheading("Tombol Panduan Data"))
story.append(p("Klik ikon buku di pojok kanan atas untuk melihat panduan singkat kategori status gizi."))
story.append(PageBreak())

# === 11. PEMECAHAN MASALAH ===
story.append(heading("11. Pemecahan Masalah"))
story.append(subheading("Tanggal tidak terbaca (NaN atau undefined)"))
story.append(p("Pastikan format tanggal yang digunakan:"))
story.append(p("• DD/MM/YYYY (contoh: 15/01/2023)"))
story.append(p("• DD-MM-YYYY"))
story.append(p("• DD.MM.YYYY"))
story.append(p("• YYYY-MM-DD"))
story.append(subheading("Data tidak muncul setelah impor"))
story.append(p("1. Periksa format file — pastikan CSV atau XLSX."))
story.append(p("2. Pastikan ada kolom dengan header yang dikenali."))
story.append(p("3. Cek notifikasi — mungkin data terdeteksi duplikat."))
story.append(subheading("Kalkulasi tidak berjalan"))
story.append(p("Pastikan usia 0–60 bulan, BB dan TB diisi, jenis kelamin dipilih."))
story.append(subheading("Aplikasi tidak bisa offline"))
story.append(p("Pastikan aplikasi sudah dimuat saat online setidaknya satu kali."))
story.append(PageBreak())

# === 12. REFERENSI ===
story.append(heading("12. Referensi"))
story.append(p("• <b>Permenkes No. 2 Tahun 2020</b> tentang Standar Antropometri Anak"))
story.append(p("• <b>WHO Child Growth Standards</b> untuk anak usia 0–5 tahun"))
story.append(p("• <b>WHO Reference 2007</b> untuk anak usia 5–18 tahun"))
story.append(p("• Kode sumber: https://github.com/gizikita/gizikita"))
story.append(p("• Aplikasi: https://gizikita.github.io"))
story.append(Spacer(1, 30))
story.append(p("—", ParagraphStyle('End', parent=body, alignment=TA_CENTER)))
story.append(p("Panduan Operasional GiziKita v1.0 — Juli 2026", ParagraphStyle('EndV', parent=body, alignment=TA_CENTER, fontSize=9, textColor=colors.gray)))

# Build PDF
doc.build(story)
print(f"PDF generated: {OUTPUT}")
