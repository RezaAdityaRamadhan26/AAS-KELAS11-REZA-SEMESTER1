# AIVEN CONNECTION CREDENTIALS TEMPLATE

## ISI DATA INI DENGAN INFO DARI AIVEN CONSOLE

```
AIVEN_HOST: _____________________ 
AIVEN_PORT: _____________________
AIVEN_USER: _____________________
AIVEN_PASSWORD: _____________________
CA_CERTIFICATE_PATH: _____________________
```

---

## COMMAND TEMPLATE - COPY DAN SESUAIKAN

### Template 1: Dengan Password Prompt (PALING AMAN)
```bash
mysql -h YOUR_AIVEN_HOST -P YOUR_AIVEN_PORT -u YOUR_AIVEN_USER -p -D defaultdb --ssl-ca="YOUR_CA_PATH" --ssl-mode=REQUIRED
```

**Contoh:**
```bash
mysql -h mysql-12345678.aivencloud.com -P 21234 -u avnadmin -p -D defaultdb --ssl-ca="C:\AAS KELAS 11\perpustakaan\aiven_ca.pem" --ssl-mode=REQUIRED
```

---

### Template 2: Dengan Password di Command (Hati-hati, jangan share command ini!)
```bash
mysql -h YOUR_AIVEN_HOST -P YOUR_AIVEN_PORT -u YOUR_AIVEN_USER -pYOUR_PASSWORD -D defaultdb --ssl-ca="YOUR_CA_PATH" --ssl-mode=REQUIRED
```

**Note:** 
- Tidak ada spasi antara `-p` dan password
- Contoh: `-pMyPassword123`

---

## CHECKLIST SEBELUM JALANKAN QUERY

- [ ] Sudah download CA certificate dari Aiven
- [ ] Host Aiven dicopy dengan benar
- [ ] Port Aiven dicopy dengan benar
- [ ] Username dicopy dengan benar
- [ ] Password disimpan dengan aman
- [ ] CA certificate path benar
- [ ] MySQL client sudah terinstall
- [ ] Test koneksi berhasil (prompt mysql> muncul)
- [ ] SHOW TABLES; menampilkan 4 tabel (books, loans, notifications, users)

---

## COMMON ISSUES & FIXES

| Issue | Solusi |
|-------|--------|
| "Can't connect to MySQL server" | Cek host/port/username/password benar dari Aiven |
| "SSL connection error" | Pastikan CA certificate file ada dan path benar |
| "Access denied for user" | Reset password di Aiven console |
| "Connection refused" | Firewall mungkin block port - cek Aiven firewall settings |
| "mysql: command not found" | MySQL client belum terinstall |

---

## SETELAH SUKSES CONNECT

Jalankan command ini untuk verify:

```sql
SHOW TABLES;
DESC books;
DESC loans;
DESC notifications;
DESC users;
```

Jika semua bisa dijalankan, Anda siap untuk jalankan migration queries!
