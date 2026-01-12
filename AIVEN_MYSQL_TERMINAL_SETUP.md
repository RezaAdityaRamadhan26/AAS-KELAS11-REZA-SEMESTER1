# SETUP MYSQL CLIENT TERMINAL UNTUK AIVEN

## 1. INFORMASI YANG DIBUTUHKAN DARI AIVEN

Login ke [console.aiven.io](https://console.aiven.io) dan cari service MySQL Anda:

**Ambil informasi berikut:**
- **Host** (Connection host)
- **Port** (Connection port)
- **Username** (Database user)
- **Password** (Password user)
- **CA Certificate** (Download file .pem)

**Lokasi di Aiven Dashboard:**
```
Services → MySQL Service → Connection Information
```

Contoh format yang akan Anda lihat:
```
Host: mysql-12345678.aivencloud.com
Port: 21234
Username: avnadmin
Password: xxxxxxxxxxxxxxxxxx
```

---

## 2. DOWNLOAD CA CERTIFICATE DARI AIVEN

### Step A: Download dari Dashboard
1. Di Aiven Console, buka service MySQL Anda
2. Tab **Connection information**
3. Scroll ke bawah, cari **"Download CA certificate"**
4. Download file `ca.pem`

### Step B: Simpan CA Certificate
Simpan di lokasi yang mudah diakses, contoh:
```
C:\AAS KELAS 11\perpustakaan\aiven_ca.pem
```

**Penting:** Jangan bagikan file ini ke orang lain!

---

## 3. INSTALL MYSQL CLIENT (Jika belum ada)

### Untuk Windows:

**Option 1: Install MySQL Server (termasuk client)**
- Download dari: https://dev.mysql.com/downloads/mysql/
- Pilih "Windows (x86, 32-bit), MSI Installer"
- Pada saat install, pastikan **"MySQL Command Line Client"** tercentang
- Setelah selesai, MySQL client sudah bisa digunakan dari terminal

**Option 2: Hanya Install MySQL Client**
```powershell
# Jika menggunakan Chocolatey
choco install mysql-connector-net
```

**Option 3: Cek apakah MySQL client sudah terinstall**
```powershell
mysql --version
```
Jika output menunjukkan versi, MySQL client sudah installed.

---

## 4. TEST KONEKSI KE AIVEN

### Format perintah terminal:
```bash
mysql -h [AIVEN_HOST] -P [PORT] -u [USERNAME] -p -D defaultdb --ssl-ca=C:\path\to\ca.pem --ssl-mode=REQUIRED
```

### Contoh nyata:
```bash
mysql -h mysql-12345678.aivencloud.com -P 21234 -u avnadmin -p -D defaultdb --ssl-ca="C:\AAS KELAS 11\perpustakaan\aiven_ca.pem" --ssl-mode=REQUIRED
```

### Step-by-step untuk test:

1. **Buka PowerShell atau Command Prompt**
   - Tekan `Win + R`
   - Ketik `cmd` atau `powershell`
   - Tekan Enter

2. **Jalankan perintah connect:**
   ```powershell
   mysql -h mysql-12345678.aivencloud.com -P 21234 -u avnadmin -p -D defaultdb --ssl-ca="C:\AAS KELAS 11\perpustakaan\aiven_ca.pem" --ssl-mode=REQUIRED
   ```
   
   **Ganti nilai berikut dengan data Aiven Anda:**
   - `mysql-12345678.aivencloud.com` → Host Anda
   - `21234` → Port Anda
   - `avnadmin` → Username Anda
   - `C:\AAS KELAS 11\perpustakaan\aiven_ca.pem` → Lokasi CA certificate Anda

3. **Masukkan password** ketika diminta
   - Anda akan diminta `Enter password:`
   - Ketik password Aiven Anda (tidak akan terlihat di layar)
   - Tekan Enter

4. **Sukses? Akan muncul prompt MySQL:**
   ```
   mysql>
   ```

5. **Test sederhana di mysql> prompt:**
   ```sql
   SHOW TABLES;
   ```
   
   Jika bisa melihat 4 tabel (books, loans, notifications, users), berarti koneksi berhasil!

---

## 5. JIKA TERJADI ERROR

### Error 1: "Can't connect to MySQL server"
```
ERROR 2003 (HY000): Can't connect to MySQL server on 'mysql-xxxxx.aivencloud.com' (110)
```

**Solusi:**
- Cek username dan password benar
- Cek host dan port benar
- Cek internet connection aktif

---

### Error 2: "SSL connection error"
```
ERROR 2026 (HY000): SSL connection error
```

**Solusi:**
- Pastikan file ca.pem sudah di-download
- Pastikan path ke ca.pem benar
- Coba tambah flag: `--ssl-mode=REQUIRED`

---

### Error 3: "Access denied for user"
```
ERROR 1045 (28000): Access denied for user 'avnadmin'@'xxxxx' (using password: YES)
```

**Solusi:**
- Cek username dan password benar dari Aiven console
- Reset password di Aiven console jika perlu

---

## 6. BUAT FILE BATCH UNTUK SHORTCUT (Optional)

Buat file `aiven_connect.bat` di folder perpustakaan:

```batch
@echo off
REM File ini untuk connect ke Aiven MySQL dengan mudah
REM GANTI NILAI BERIKUT DENGAN DATA AIVEN ANDA

set AIVEN_HOST=mysql-12345678.aivencloud.com
set AIVEN_PORT=21234
set AIVEN_USER=avnadmin
set AIVEN_DB=defaultdb
set CA_PATH=C:\AAS KELAS 11\perpustakaan\aiven_ca.pem

mysql -h %AIVEN_HOST% -P %AIVEN_PORT% -u %AIVEN_USER% -p -D %AIVEN_DB% --ssl-ca="%CA_PATH%" --ssl-mode=REQUIRED
```

**Cara menggunakan:**
1. Ganti nilai di atas dengan data Aiven Anda
2. Simpan sebagai `aiven_connect.bat` di folder perpustakaan
3. Double-click file `aiven_connect.bat` untuk connect otomatis

---

## 7. SEKARANG JALANKAN QUERIES

Setelah berhasil connect ke MySQL terminal, Anda bisa jalankan query:

```sql
USE defaultdb;
```

Lalu copy-paste query dari file-file ini satu per satu:
1. `SIMPLE_QUERIES.sql` (Paling mudah, 2 menit)
2. Atau `MYSQL_TERMINAL_QUERIES.sql` (Dengan penjelasan)

**Contoh:**
```sql
mysql> USE defaultdb;
mysql> INSERT IGNORE INTO categories (name, description) SELECT DISTINCT genre, CONCAT('Kategori: ', genre) FROM books WHERE genre IS NOT NULL;
mysql> SELECT * FROM categories;
```

---

## 8. TROUBLESHOOTING CHECKLIST

- [ ] CA certificate sudah di-download dari Aiven
- [ ] CA certificate path benar di command
- [ ] Host dan Port dari Aiven sudah dicopy dengan benar
- [ ] Username dan Password sudah dicopy dengan benar
- [ ] MySQL client sudah terinstall (`mysql --version` bisa dijalankan)
- [ ] Internet connection aktif
- [ ] Coba koneksi test terlebih dahulu sebelum jalankan queries besar

---

## 9. REFERENCE COMMAND

**Full template:**
```bash
mysql -h [HOST] -P [PORT] -u [USER] -p -D defaultdb --ssl-ca="[CA_PATH]" --ssl-mode=REQUIRED
```

**Contoh dengan nilai:**
```bash
mysql -h mysql-12345678.aivencloud.com -P 21234 -u avnadmin -p -D defaultdb --ssl-ca="C:\AAS KELAS 11\perpustakaan\aiven_ca.pem" --ssl-mode=REQUIRED
```

---

## NEXT STEPS

1. ✅ Download CA certificate dari Aiven
2. ✅ Install MySQL client (jika belum)
3. ✅ Test koneksi dengan command di atas
4. ✅ Jalankan queries dari `SIMPLE_QUERIES.sql`
5. ✅ Verify hasil dengan `SELECT * FROM categories;`
