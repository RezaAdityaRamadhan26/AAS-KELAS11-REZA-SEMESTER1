# Troubleshooting Login 401 Error

## ❌ Error: Failed to load resource - 401 pada /api/auth/callback/credentials

### Penyebab Utama:

1. **Password di database TIDAK diupdate ke rounds 6**
   - Kode sekarang pakai bcrypt rounds 6
   - Tapi password lama masih rounds 10
   - bcrypt.compare() gagal karena mismatch

2. **NEXTAUTH_SECRET / NEXTAUTH_URL tidak set di Vercel**

3. **Database tidak terhubung saat login**

---

## ✅ Solusi:

### Step 1: Check Password di Database

Jalankan di MySQL terminal:

```sql
SELECT username, 
       CASE 
           WHEN password LIKE '$2a$06$%' THEN 'Rounds 6 ✓'
           WHEN password LIKE '$2a$10$%' THEN 'Rounds 10 ✗ (PERLU UPDATE)'
           ELSE 'Unknown'
       END as status
FROM users;
```

Jika muncul `Rounds 10`, password perlu di-update!

### Step 2: Update Password ke Rounds 6

Jika masih rounds 10, jalankan:

```sql
-- Update admin (password: admin123)
UPDATE users 
SET password = '$2a$06$7vJZE.7P8qMQz3M0L.6.yOxGRZVhKx8CqE4fM.zJYxZ9g5k9KiMFW'
WHERE username = 'admin';

-- Update student1 (password: student123)
UPDATE users 
SET password = '$2a$06$7vJZE.7P8qMQz3M0L.6.yOxGRZVhKx8CqE4fM.zJYxZ9g5k9KiMFW'
WHERE username = 'student1';
```

Atau gunakan file: [CHECK_DATABASE_STATE.sql](CHECK_DATABASE_STATE.sql)

### Step 3: Verifikasi Vercel Environment Variables

Di Vercel Project Settings → Environment Variables, pastikan ada:

- ✓ `DATABASE_HOST` = mysql-xxxxx.aivencloud.com
- ✓ `DATABASE_PORT` = 21234
- ✓ `DATABASE_USER` = avnadmin
- ✓ `DATABASE_PASSWORD` = xxxxxxx
- ✓ `DATABASE_NAME` = defaultdb
- ✓ `CA_CERT` = (full text PEM certificate, mulai -----BEGIN CERTIFICATE-----)
- ✓ `NEXTAUTH_SECRET` = (random string 32+ chars)
- ✓ `NEXTAUTH_URL` = https://starlib.vercel.app

### Step 4: Redeploy di Vercel

Setelah update password dan env, klik **Redeploy**:
1. Buka Vercel Dashboard
2. Pilih project
3. Deployments → Kebab menu (3 dots) → Redeploy

### Step 5: Test Login Lagi

Coba login dengan:
- Username: `admin` / Password: `admin123`
- Username: `student1` / Password: `student123`

---

## 🔍 Debug Tips:

1. **Check Vercel Logs**: Deployment → View Logs
   - Cari "Auth success" atau "Password mismatch"
   
2. **Test Database Connection**: 
   - Buka https://starlib.vercel.app/api/health
   - Harus return `{"status":"ok"}`

3. **Check Browser Console**: 
   - F12 → Console
   - Cari error messages lebih detail

---

## 📋 Checklist:

- [ ] Sudah jalankan CHECK_DATABASE_STATE.sql dan lihat hasilnya
- [ ] Jika rounds 10, sudah jalankan UPDATE password
- [ ] Verifikasi NEXTAUTH_SECRET dan NEXTAUTH_URL di Vercel
- [ ] Sudah redeploy di Vercel
- [ ] Test /api/health = 200 OK
- [ ] Coba login lagi

Jika masih error 401, check Vercel logs untuk lihat detail error!
