# KMP-Doc-search-pro-implementasi-algoritma-Knuth-morris-pratt-
sebuah projeck desain dan analisis universitas muhammadiyah makassar 2026
# KMP Doc-search Pro - Implementasi Knuth-Morris-Pratt (KMP)

**Deskripsi singkat**
Aplikasi pencarian dokumen berbasis teks yang menggunakan algoritma Knuth-Morris-Pratt (KMP) untuk menemukan kemunculan keyword secara cepat pada banyak berkas teks.

✨ Fitur utama
- Pencarian cepat dalam folder `data_dokumen` menggunakan KMP (case-insensitive)
- Upload file dan pencarian pada file yang diunggah
- Menampilkan snippet hasil dengan kata kunci yang di-highlight
- Endpoint API untuk mengambil isi file (`/get-file/<filename>`)

📁 Struktur singkat proyek
```
projek_kmp/
├─ main.py
├─ templates/index.html
├─ static/style.css
├─ static/script.js
├─ data_dokumen/      # kumpulan dokumen .txt
├─ uploads/            # file yang di-upload saat testing
└─ README.md
```

⚙️ Prasyarat
- Python 3.8+ (direkomendasikan 3.10/3.11)
- pip

📥 Instalasi & Menjalankan (Windows cmd)
1. Buka folder proyek:
```bash
cd "C:\Users\Muh Ikhsan Radjab\OneDrive\Desktop\projek_kmp"
```
2. (Opsional) Buat virtual environment dan aktifkan:
```bash
python -m venv venv
venv\Scripts\activate
```
3. Install dependensi:
```bash
pip install -r requirements.txt
```
4. Jalankan aplikasi:
```bash
python main.py
```
5. Buka web: http://127.0.0.1:5000

🔍 Cara menggunakan
- Pada halaman utama, pilih mode `folder` untuk mencari pada kumpulan berkas di `data_dokumen`.
- Masukkan kata kunci, klik `Search`. Hasil teratas ditampilkan dengan snippet yang berisi `mark` tag untuk highlight.
- Untuk mengetes file sendiri, gunakan `Upload` lalu `Search`.

🧪 Contoh pengujian singkat
- Pastikan ada beberapa berkas `.txt` di `data_dokumen`.
- Cari kata yang pasti ada seperti `kmp` atau `algoritma`.
- Periksa apakah hasil menampilkan `count`, `snippet`, dan highlight.

🔐 Keamanan & Catatan
- Direktori `uploads/` dimasukkan ke `.gitignore` agar file uji tidak terdorong ke repo publik.
- Hindari mengunggah file besar (>100 MB) via UI.

📌 Push ke GitHub (setelah Anda menambahkan/commit file lokal)
```bash
git add .
git commit -m "Add README and project files"
# ganti URL remote jika perlu
git remote add origin https://github.com/MuhammadIkhsanRadjab/KMP-Doc-search-pro-implementasi-algoritma-Knuth-morris-pratt-.git
git branch -M main
git push -u origin main
```

📚 Referensi & Pengembangan lebih lanjut
- Penjelasan KMP: https://en.wikipedia.org/wiki/Knuth–Morris–Pratt_algorithm
- Rencana: tambahkan tests, CI (GitHub Actions), dan dokumentasi lebih lengkap.

---
Jika Anda ingin, saya bisa juga membuat `requirements.txt` dan `.gitignore`, lalu berikan langkah yang tinggal Anda jalankan untuk commit & push. 🚀
