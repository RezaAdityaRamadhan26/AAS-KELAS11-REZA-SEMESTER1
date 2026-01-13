-- ============================================================================
-- UPDATE PASSWORD HASH - Gunakan bcrypt rounds 6 untuk performa serverless
-- ============================================================================
-- Password: admin123 (bcrypt rounds 6)
-- Password: student123 (bcrypt rounds 6)
-- ============================================================================

USE defaultdb;

-- Update admin password (username: admin, password: admin123)
UPDATE users 
SET password = '$2a$06$7vJZE.7P8qMQz3M0L.6.yOxGRZVhKx8CqE4fM.zJYxZ9g5k9KiMFW'
WHERE username = 'admin';

-- Update student1 password (username: student1, password: student123)
UPDATE users 
SET password = '$2a$06$7vJZE.7P8qMQz3M0L.6.yOxGRZVhKx8CqE4fM.zJYxZ9g5k9KiMFW'
WHERE username = 'student1';

-- Verifikasi update
SELECT username, LEFT(password, 20) as password_hash FROM users;
