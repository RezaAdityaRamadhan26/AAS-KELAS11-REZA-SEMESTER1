# Panduan Deployment ke Vercel

## Persiapan Sebelum Deploy

### 1. Setup Database Online
Karena Vercel adalah serverless platform, Anda perlu database online seperti:
- **PlanetScale** (MySQL, free tier tersedia)
- **Railway** (MySQL/PostgreSQL, free tier tersedia)
- **Aiven** (MySQL, free tier tersedia)
- **Amazon RDS** (MySQL)

### 2. Import Database Schema
Upload database schema ke database online Anda:
```sql
-- Gunakan file database_migration_updated.sql
```

### 3. Siapkan Environment Variables
Environment variables yang diperlukan:
- `DB_HOST` - Host database online Anda
- `DB_USER` - Username database
- `DB_PASSWORD` - Password database
- `DB_NAME` - Nama database (perpustakaan)
- `NEXTAUTH_SECRET` - Generate dengan: `openssl rand -base64 32`
- `NEXTAUTH_URL` - URL production Anda (misal: https://your-app.vercel.app)

## Langkah Deployment ke Vercel

### Opsi 1: Deploy via GitHub

1. **Push ke GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Connect ke Vercel**
   - Buka [vercel.com](https://vercel.com)
   - Login dengan GitHub
   - Klik "Add New Project"
   - Import repository `AAS-KELAS11-REZA-SEMESTER1`

3. **Configure Project**
   - Framework Preset: Next.js (auto-detected)
   - Root Directory: `./`
   - Build Command: `next build` (default)
   - Output Directory: `.next` (default)

4. **Set Environment Variables**
   Di Vercel Dashboard → Settings → Environment Variables, tambahkan:
   ```
   DB_HOST=your-online-db-host
   DB_USER=your-db-user
   DB_PASSWORD=your-db-password
   DB_NAME=perpustakaan
   NEXTAUTH_SECRET=your-generated-secret
   NEXTAUTH_URL=https://your-app.vercel.app
   NODE_ENV=production
   ```

5. **Deploy**
   - Klik "Deploy"
   - Tunggu hingga build selesai (~2-3 menit)

### Opsi 2: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```

4. **Set Environment Variables**
   ```bash
   vercel env add DB_HOST
   vercel env add DB_USER
   vercel env add DB_PASSWORD
   vercel env add DB_NAME
   vercel env add NEXTAUTH_SECRET
   vercel env add NEXTAUTH_URL
   ```

5. **Redeploy dengan Environment Variables**
   ```bash
   vercel --prod
   ```

## Troubleshooting

### Error: "useSearchParams() should be wrapped in suspense"
✅ **Sudah diperbaiki** - Komponen login sudah dibungkus dengan Suspense boundary

### Error: Database connection refused
- ❌ Pastikan database online sudah running
- ❌ Periksa credentials (host, user, password) di Environment Variables
- ❌ Pastikan database dapat diakses dari internet (bukan localhost)
- ❌ Whitelist IP address Vercel jika database memerlukan

### Error: NEXTAUTH_SECRET not configured
- Set environment variable `NEXTAUTH_SECRET` di Vercel
- Generate secret: `openssl rand -base64 32`

### Error: Middleware warning
⚠️ **Warning saja, tidak masalah** - Vercel masih support middleware file convention

### Build Success tapi Runtime Error
- Periksa logs di Vercel Dashboard → Deployments → View Function Logs
- Pastikan semua environment variables sudah di-set dengan benar
- Test koneksi database dari local dengan credentials online

## Rekomendasi Database Online (Free Tier)

### 1. PlanetScale (Recommended)
- ✅ MySQL kompatibel
- ✅ 5GB storage gratis
- ✅ Auto-scaling
- ✅ Backup otomatis
- 🔗 [planetscale.com](https://planetscale.com)

### 2. Railway
- ✅ MySQL/PostgreSQL
- ✅ $5 credit per bulan
- ✅ Easy setup
- 🔗 [railway.app](https://railway.app)

### 3. Aiven
- ✅ MySQL kompatibel
- ✅ Free tier 30 hari
- ✅ Multi-cloud
- 🔗 [aiven.io](https://aiven.io)

## Setelah Deployment

1. **Test Login**
   - Admin: `admin` / `admin123`
   - Siswa: `siswa` / `siswa123`

2. **Update NEXTAUTH_URL**
   - Jika menggunakan custom domain, update `NEXTAUTH_URL` di Environment Variables
   - Redeploy setelah update

3. **Monitor Logs**
   - Vercel Dashboard → Deployments → View Function Logs
   - Periksa error atau warning

4. **Setup Custom Domain (Optional)**
   - Vercel Dashboard → Settings → Domains
   - Add custom domain
   - Update DNS records sesuai instruksi

## File Penting untuk Deployment

- ✅ `vercel.json` - Konfigurasi Vercel
- ✅ `.env.example` - Template environment variables
- ✅ `.gitignore` - Prevent committing sensitive files
- ✅ `app/(auth)/login/page.jsx` - Fixed Suspense boundary
- ✅ `app/admin/dashboard/page.jsx` - Dynamic rendering
- ✅ `app/page.jsx` - Dynamic rendering

## Catatan Penting

⚠️ **JANGAN commit file `.env.local`** ke Git (sudah di-ignore)
⚠️ **SELALU gunakan database online** untuk production (bukan localhost)
⚠️ **Generate NEXTAUTH_SECRET baru** untuk production (jangan gunakan default)
⚠️ **Pastikan upload folder `public/images/books/`** ke Git jika ada gambar yang sudah ada

## Butuh Bantuan?

- 📖 [Next.js Deployment Docs](https://nextjs.org/docs/deployment)
- 📖 [Vercel Docs](https://vercel.com/docs)
- 💬 Vercel Support: support@vercel.com
