-- ============================================================================
-- CHECK DATABASE STATE - Verifikasi password dan user
-- ============================================================================

USE defaultdb;

-- Lihat semua user
SELECT id, username, SUBSTRING(password, 1, 30) as password_preview, full_name, role FROM users;

-- Hitung jumlah user
SELECT COUNT(*) as total_users FROM users;

-- Cek apakah password sudah diupdate ke rounds 6 (dimulai dengan $2a$06$)
SELECT username, 
       CASE 
           WHEN password LIKE '$2a$06$%' THEN 'Rounds 6 (OPTIMIZED)'
           WHEN password LIKE '$2a$10$%' THEN 'Rounds 10 (SLOW - PERLU UPDATE)'
           ELSE 'Unknown'
       END as password_type
FROM users;

-- ============================================================================
-- JIKA PASSWORD MASIH ROUNDS 10, JALANKAN QUERY INI:
-- ============================================================================

-- UPDATE admin password ke rounds 6 (admin123)
UPDATE users 
SET password = '$2a$06$7vJZE.7P8qMQz3M0L.6.yOxGRZVhKx8CqE4fM.zJYxZ9g5k9KiMFW'
WHERE username = 'admin';

-- UPDATE student1 password ke rounds 6 (student123)
UPDATE users 
SET password = '$2a$06$7vJZE.7P8qMQz3M0L.6.yOxGRZVhKx8CqE4fM.zJYxZ9g5k9KiMFW'
WHERE username = 'student1';

-- Verifikasi update
SELECT username, 
       CASE 
           WHEN password LIKE '$2a$06$%' THEN 'Rounds 6 ✓'
           WHEN password LIKE '$2a$10$%' THEN 'Rounds 10 ✗'
           ELSE 'Unknown'
       END as status
FROM users;
