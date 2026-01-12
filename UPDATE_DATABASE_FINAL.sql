-- ============================================================================
-- CREATE DATABASE LENGKAP - PERPUSTAKAAN SEKOLAH
-- ============================================================================
-- Database: defaultdb
-- Koneksi: mysql -h [HOST] -P [PORT] -u [USER] -p -D defaultdb --ssl-ca="[CA_PATH]"
-- ============================================================================

USE defaultdb;

-- ============================================================================
-- HAPUS TABEL LAMA (HATI-HATI: DATA AKAN HILANG!)
-- ============================================================================
-- Uncomment jika ingin hapus tabel lama dan buat ulang dari awal

-- DROP TABLE IF EXISTS notifications;
-- DROP TABLE IF EXISTS loans;
-- DROP TABLE IF EXISTS books;
-- DROP TABLE IF EXISTS users;

-- ============================================================================
-- 1. CREATE TABLE USERS
-- ============================================================================

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role ENUM('admin', 'siswa') NOT NULL DEFAULT 'siswa',
    class_grade VARCHAR(20),
    email VARCHAR(100),
    phone VARCHAR(15),
    is_active BOOLEAN DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_username (username),
    INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================================
-- 2. CREATE TABLE BOOKS
-- ============================================================================

CREATE TABLE IF NOT EXISTS books (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(100) NOT NULL,
    publisher VARCHAR(100),
    publication_year INT,
    genre VARCHAR(50),
    category VARCHAR(50),
    isbn VARCHAR(20),
    description TEXT,
    image VARCHAR(255),
    stock INT DEFAULT 10,
    rating DECIMAL(3,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_title (title),
    INDEX idx_author (author),
    INDEX idx_genre (genre),
    INDEX idx_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================================
-- 3. CREATE TABLE LOANS
-- ============================================================================

CREATE TABLE IF NOT EXISTS loans (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    book_id INT NOT NULL,
    loan_date DATE NOT NULL,
    due_date DATE NOT NULL,
    return_date DATE,
    status ENUM('pending', 'dipinjam', 'kembali', 'hilang') NOT NULL DEFAULT 'pending',
    fine_amount DECIMAL(10,2) DEFAULT 0,
    approved_by INT,
    approved_at TIMESTAMP NULL,
    daily_fine_amount DECIMAL(10,2) DEFAULT 5000,
    total_fine DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
    FOREIGN KEY (approved_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_book_id (book_id),
    INDEX idx_status (status),
    INDEX idx_loan_date (loan_date),
    INDEX idx_due_date (due_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================================
-- 4. CREATE TABLE NOTIFICATIONS
-- ============================================================================

CREATE TABLE IF NOT EXISTS notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    type ENUM('success', 'info', 'warning', 'error') NOT NULL DEFAULT 'info',
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    read_status BOOLEAN DEFAULT 0,
    related_loan_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (related_loan_id) REFERENCES loans(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_read_status (read_status),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================================
-- 5. INSERT DATA SAMPLE (OPTIONAL)
-- ============================================================================

-- Insert admin user (password: admin123)
INSERT INTO users (username, password, full_name, role, email, is_active) 
VALUES ('admin', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Administrator', 'admin', 'admin@sekolah.id', 1);

-- Insert sample student (password: student123)
    INSERT INTO users (username, password, full_name, role, email, is_active) 
    VALUES ('student1', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Siswa Satu', 'siswa', 'student1@sekolah.id', 1);

-- Insert sample books
INSERT INTO books (title, author, publisher, publication_year, genre, category, stock, description, image) 
VALUES 
('Laskar Pelangi', 'Andrea Hirata', 'Bentang Pustaka', 2005, 'Novel', 'Fiksi', 5, 'Novel tentang perjuangan anak-anak di Belitung', '/images/books/laskar-pelangi.jpg'),
('Bumi Manusia', 'Pramoedya Ananta Toer', 'Hasta Mitra', 1980, 'Novel', 'Sejarah', 3, 'Novel tetralogi Buru pertama', '/images/books/bumi-manusia.jpg'),
('Matematika SMA Kelas 11', 'Tim Penulis', 'Erlangga', 2020, 'Pelajaran', 'Pendidikan', 10, 'Buku pelajaran matematika untuk SMA', '/images/books/matematika-sma-11.jpg');

-- ============================================================================
-- 6. VERIFIKASI TABEL DAN DATA
-- ============================================================================

SHOW TABLES;

SELECT 'USERS' as table_name, COUNT(*) as total_records FROM users;
SELECT 'BOOKS' as table_name, COUNT(*) as total_records FROM books;
SELECT 'LOANS' as table_name, COUNT(*) as total_records FROM loans;
SELECT 'NOTIFICATIONS' as table_name, COUNT(*) as total_records FROM notifications;

-- ============================================================================
-- SELESAI!
-- ============================================================================
