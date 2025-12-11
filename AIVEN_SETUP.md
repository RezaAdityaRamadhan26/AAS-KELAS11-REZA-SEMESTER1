# Setup Aiven Database - Langkah demi Langkah

## ✅ Status Saat Ini
- [x] Service Aiven MySQL dibuat
- [x] CA Certificate didownload
- [x] Konfigurasi lokal sudah benar
- [ ] **MENUNGGU: Service sedang rebuilding** ⏳
- [ ] Import database schema
- [ ] Test koneksi
- [ ] Setup Vercel

## 📋 Connection Details Anda

```
Host: your-aiven-host.aivencloud.com
Port: your-port
User: avnadmin
Password: your-password-here
Database: defaultdb
SSL Mode: REQUIRED
```

## ⏳ LANGKAH 1: Tunggu Service Ready

**STATUS SEKARANG: REBUILDING** 🔄

1. Buka halaman Aiven service Anda
2. Tunggu sampai status berubah dari "Rebuilding" menjadi **"Running"**
3. Biasanya memakan waktu **5-15 menit**
4. Refresh halaman setiap 1-2 menit

**Tanda service sudah ready:**
- ✅ Status badge hijau bertulisan "Running"
- ✅ Tidak ada loading icon
- ✅ Bisa klik "Quick connect"

---

## 🚀 LANGKAH 2: Setelah Service Running

Setelah status "Running", jalankan perintah ini di terminal VS Code:

### Test Koneksi
```bash
node setup-aiven.js
```

**Output yang diharapkan:**
```
🔌 Connecting to Aiven MySQL...
✅ Connected successfully!
📝 Found X SQL statements to execute
✅ Executed statement 1/X
✅ Executed statement 2/X
...
📊 Tables in database:
  - users
  - books
  - loans
  - notifications
👥 Users created:
  - admin (admin)
  - siswa (siswa)
✅ Database setup complete!
```

### Jika Koneksi Berhasil
Database Anda sudah siap! Lanjut ke **LANGKAH 3**.

### Jika Masih Error
- Tunggu 5 menit lagi, service mungkin belum sepenuhnya ready
- Coba lagi dengan: `node setup-aiven.js`

---

## 🔧 LANGKAH 3: Setup Vercel Environment Variables

Setelah database berhasil di-import:

1. **Buka Vercel Dashboard**
   - https://vercel.com/dashboard
   - Pilih project: `perpustakaan-website`

2. **Go to Settings → Environment Variables**

3. **Tambahkan variables ini satu per satu:**

   **DB_HOST**
   ```
   your-aiven-host.aivencloud.com
   ```

   **DB_PORT**
   ```
   your-port
   ```

   **DB_USER**
   ```
   avnadmin
   ```

   **DB_PASSWORD**
   ```
   your-aiven-password
   ```

   **DB_NAME**
   ```
   defaultdb
   ```

   **NEXTAUTH_SECRET**
   Generate dengan command:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
   ```
   Copy hasilnya dan paste ke Vercel.

   **NEXTAUTH_URL**
   ```
   https://perpustakaan-website-iy3he02jt-rezaadityaramadhan26s-projects.vercel.app
   ```

   **CA_CERT**
   Buka file `ca.pem`, copy SEMUA isi file (termasuk `-----BEGIN CERTIFICATE-----` dan `-----END CERTIFICATE-----`), paste ke Vercel.

   **NODE_ENV**
   ```
   production
   ```

4. **Set untuk Environment: Production, Preview, Development** (centang semua)

---

## 📤 LANGKAH 4: Redeploy Vercel

Setelah semua environment variables di-set:

### Option 1: Via Git Push
```bash
git add .
git commit -m "Configure Aiven database"
git push origin main
```

Vercel akan auto-deploy dengan environment variables baru.

### Option 2: Via Vercel Dashboard
1. Go to Deployments tab
2. Klik titik tiga (...) pada deployment terakhir
3. Pilih "Redeploy"

---

## ✅ LANGKAH 5: Test Production

Setelah deployment selesai:

1. **Buka aplikasi Anda:**
   ```
   https://perpustakaan-website-iy3he02jt-rezaadityaramadhan26s-projects.vercel.app
   ```

2. **Test Login:**
   - Admin: `admin` / `admin123`
   - Siswa: `siswa` / `siswa123`

3. **Test Fitur:**
   - ✅ Landing page tampil buku
   - ✅ Login berhasil
   - ✅ Dashboard admin tampil data
   - ✅ CRUD buku berfungsi
   - ✅ Peminjaman berfungsi

---

## 🆘 Troubleshooting

### Error: Connection timeout
- ✅ Pastikan service Aiven status "Running"
- ✅ Cek IP whitelist di Aiven (set ke 0.0.0.0/0 untuk allow semua)

### Error: SSL connection error
- ✅ Pastikan CA_CERT di Vercel sudah benar
- ✅ CA certificate harus full text termasuk BEGIN/END

### Error: Authentication failed
- ✅ Double-check password di environment variables
- ✅ Pastikan tidak ada spasi atau typo

### Error: Database not found
- ✅ Pastikan DB_NAME = `defaultdb` (bukan `db_perpustakaan_sekolah`)

---

## 📝 Checklist

- [ ] Service Aiven status "Running"
- [ ] Run `node setup-aiven.js` berhasil
- [ ] Database tables created (users, books, loans, notifications)
- [ ] Test data inserted (admin & siswa users)
- [ ] Vercel environment variables di-set (8 variables)
- [ ] Git push & redeploy
- [ ] Production test: landing page works
- [ ] Production test: login works
- [ ] Production test: dashboard shows data

---

## 🎉 Setelah Semua Selesai

Project Anda akan:
- ✅ Deploy di Vercel dengan database online
- ✅ Login admin & siswa berfungsi
- ✅ Semua fitur CRUD berfungsi
- ✅ SSL/TLS secure connection
- ✅ Ready untuk production use!

---

## 📞 Need Help?

Jika ada error, screenshot dan kirim:
1. Error message dari terminal
2. Error logs dari Vercel (Deployments → View Function Logs)
3. Status service di Aiven dashboard
