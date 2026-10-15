# 🇯🇵 Kuis Kotoba Minna no Nihongo (Bab 1 – 50)

Aplikasi web kuis interaktif modern untuk menguji dan memperdalam penguasaan kosakata (*kotoba*) Bahasa Jepang berdasarkan buku **Minna no Nihongo I & II (Bab 1 sampai Bab 50)** dengan total **2.910 kosakata lengkap**.

Dirancang dengan tampilan bersih, responsif, dan nyaman untuk penggunaan di **PC Desktop** maupun **Smartphone (HP)**.

---

## ✨ Fitur Unggulan

- **📚 50 Bab Lengkap (2.910 Kotoba):**
  - Mencakup Bab 1–25 (Tingkat Dasar I / N5) dan Bab 26–50 (Tingkat Dasar II / N4).
  - Setiap bab menguji **100% seluruh kosakata** sesuai daftar dokumen Minna no Nihongo (tanpa dipotong).
- **🔊 Pelafalan Suara Otomatis & Manual (Web Speech API):**
  - Dengarkan pelafalan asli bahasa Jepang (aksen Tokyo/Japan) untuk setiap kata dengan menekan ikon speaker.
- **⏱️ Timer Dinamis Terintegrasi:**
  - Waktu pengerjaan disesuaikan secara proporsional dengan jumlah soal per bab (rata-rata 30 detik per soal) dengan peringatan visual saat waktu tersisa sedikit.
- **📊 Evaluasi & Pembahasan Komprehensif:**
  - Skor nilai (0–100), jumlah benar/salah, durasi pengerjaan, dan akurasi.
  - Review lengkap seluruh butir soal dengan status benar/salah beserta penjelasan arti dan konteksnya.
- **📲 Integrasi Laporan Hasil ke WhatsApp:**
  - Tombol sekali klik untuk membagikan rekap hasil ujian siswa/peserta ke grup kelas atau sensei via WhatsApp dengan template pesan rapi.
- **📱 Desain Responsif & Tipografi Proporsional:**
  - Bebas tombol berlebih/alat yang tidak diperlukan.
  - Ukuran font seimbang di PC dan HP, bebas horizontal scroll, dan ramah pengguna.
- **🚀 Siap Deploy ke GitHub Pages:**
  - Dilengkapi workflow GitHub Actions otomatis di `.github/workflows/deploy.yml`.

---

## 🛠️ Teknologi yang Digunakan

- **Frontend Framework:** React 19 (TypeScript)
- **Bundler & Build Tool:** Vite
- **Styling:** Tailwind CSS v4
- **Icons:** Lucide React
- **Efek Visual:** Canvas Confetti

---

## 🚀 Panduan Menjalankan di Komputer Lokal

### 1. Prasyarat
Pastikan komputer Anda sudah terinstal:
- [Node.js](https://nodejs.org/) (versi 18 atau 20+ disarankan)
- [Git](https://git-scm.com/)

### 2. Clone Repository
```bash
git clone https://github.com/USERNAME/NAMA-REPO.git
cd NAMA-REPO
```

### 3. Instal Dependensi
```bash
npm install
```

### 4. Jalankan Server Pengembangan
```bash
npm run dev
```
Buka browser dan akses alamat `http://localhost:3000`.

### 5. Build untuk Produksi
```bash
npm run build
```
Hasil build akan tersimpan di folder `dist/` dan siap diunggah ke hosting statis mana pun (GitHub Pages, Vercel, Netlify, Cloudflare Pages).

---

## 📤 Panduan Push ke GitHub

Jika Anda baru membuat repository baru di GitHub, jalankan perintah berikut di terminal:

```bash
# 1. Inisialisasi git repository
git init

# 2. Tambahkan seluruh file proyek
git add .

# 3. Lakukan commit pertama
git commit -m "feat: rilis kuis kotoba minna no nihongo bab 1-50 lengkap"

# 4. Ubah branch utama menjadi main
git branch -M main

# 5. Hubungkan ke repository GitHub Anda (ganti URL di bawah dengan repository Anda)
git remote add origin https://github.com/USERNAME/NAMA-REPO.git

# 6. Push kode ke GitHub
git push -u origin main
```

---

## 🌐 Deploy Otomatis ke GitHub Pages

Proyek ini sudah dilengkapi file workflow `.github/workflows/deploy.yml`.

Untuk mengaktifkan GitHub Pages:
1. Masuk ke repository Anda di GitHub.
2. Buka tab **Settings** > **Pages**.
3. Pada bagian **Build and deployment** > **Source**, pilih **GitHub Actions**.
4. Setiap kali Anda melakukan `git push` ke branch `main`, website akan otomatis di-build dan tayang di alamat:
   ```
   https://USERNAME.github.io/NAMA-REPO/
   ```

---

## 📖 Ringkasan Jumlah Kotoba per Bab

| Bab | Materi / Topik | Jumlah Kotoba |
|:---:|:---|:---:|
| 1 | Perkenalan Diri & Profesi | 38 |
| 2 | Benda di Sekitar Kita | 45 |
| 3 | Tempat & Lokasi | 42 |
| 4 | Waktu, Jam, & Hari | 42 |
| 5 | Transportasi & Bepergian | 45 |
| 6 | Makanan, Minuman, & Aktivitas | 48 |
| 7 | Alat, Hadiah, & Kegiatan | 47 |
| 8 | Kata Sifat (Deskripsi) | 49 |
| 9 | Kemampuan & Kesukaan | 48 |
| 10 | Keberadaan Orang & Benda | 47 |
| 11 | Bilangan & Menghitung | 54 |
| 12 | Perbandingan & Cuaca | 52 |
| 13 | Keinginan & Keperluan | 47 |
| 14 | Bentuk Kata Kerja -Te | 56 |
| 15 | Izin & Larangan | 49 |
| 16 | Rangkaian Kegiatan | 56 |
| 17 | Bentuk Kata Kerja -Nai | 57 |
| 18 | Bentuk Kamus (Kamus Jisho) | 61 |
| 19 | Bentuk -Ta & Pengalaman | 56 |
| 20 | Bentuk Percakapan Kasual | 56 |
| 21 | Pendapat & Pikiran | 58 |
| 22 | Kalimat Majemuk Bertingkat | 58 |
| 23 | Waktu Kondisional (Toki) | 60 |
| 24 | Memberi & Menerima (Kuremasu) | 59 |
| 25 | Pengandaian (-Tara) | 60 |
| 26 | Penjelasan Kasual (-N desu) | 65 |
| 27 | Bentuk Potensial (Bisa) | 66 |
| 28 | Dua Aksi Sekaligus (-Nagara) | 63 |
| 29 | Keadaan Selesai Terjadi | 64 |
| 30 | Tindakan Persiapan (-Te arimasu) | 64 |
| 31 | Bentuk Ajakan / Niat (Ikoukei) | 65 |
| 32 | Saran & Prediksi (Hou ga ii) | 63 |
| 33 | Perintah & Larangan (Meireikei) | 65 |
| 34 | Sesuai Dengan (-Toori ni) | 64 |
| 35 | Bentuk Pengandaian (-Ba) | 65 |
| 36 | Berusaha Agar (-You ni) | 67 |
| 37 | Bentuk Pasif (Ukemi) | 66 |
| 38 | Nominalisasi Kata Kerja (-No) | 65 |
| 39 | Sebab Akibat (-Te / -Node) | 67 |
| 40 | Pertanyaan Tak Langsung (-Ka) | 66 |
| 41 | Memberi & Menerima Hormat | 65 |
| 42 | Tujuan & Manfaat (-Tame ni) | 68 |
| 43 | Tampaknya / Kelihatannya (-Sou) | 66 |
| 44 | Terlalu Berlebihan (-Sugiru) | 68 |
| 45 | Situasi / Kejadian (Baai) | 67 |
| 46 | Baru Saja / Tepat Waktu | 68 |
| 47 | Konfirmasi Berita (Sou desu) | 68 |
| 48 | Bentuk Kausatif (Menyuruh) | 67 |
| 49 | Bahasa Hormat (Sonkeigo) | 70 |
| 50 | Bahasa Merendah (Kenjougo) | 71 |
| **Total** | **Bab 1 s/d 50 Lengkap** | **2.910 Kotoba** |

---

## 📜 Lisensi

Materi kosakata didasarkan pada kurikulum pembelajaran Minna no Nihongo (Agus Hinji). Kode sumber aplikasi ini didistribusikan di bawah lisensi [Apache-2.0](LICENSE).
