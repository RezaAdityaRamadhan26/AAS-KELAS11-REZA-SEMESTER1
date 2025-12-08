-- 1. RESET DATABASE
CREATE DATABASE db_perpustakaan_sekolah;
USE db_perpustakaan_sekolah;

-- 2. STRUKTUR TABEL

-- Tabel Users (Admin & Siswa)
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,       -- Menyimpan Hash Bcrypt
    full_name VARCHAR(100) NOT NULL,
    role ENUM('admin', 'siswa') NOT NULL,
    class_grade VARCHAR(20) NULL,         -- NULL jika Admin
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel Books (Buku)
CREATE TABLE books (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(100) NOT NULL,
    publisher VARCHAR(100) NOT NULL,
    publication_year INT NOT NULL,
    genre VARCHAR(50) NOT NULL,
    description TEXT,
    image VARCHAR(255),               -- Menyimpan path gambar (/images/nama.png)
    stock INT DEFAULT 10,             -- Default stok buku ada 10
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel Loans (Peminjaman)
CREATE TABLE loans (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    book_id INT NOT NULL,
    
    loan_date DATE NOT NULL,              -- Tanggal Pinjam
    due_date DATE NOT NULL,               -- Tanggal Jatuh Tempo
    return_date DATE NULL,                -- Tanggal Kembali (NULL = Belum kembali)
    
    status ENUM('dipinjam', 'kembali', 'hilang') DEFAULT 'dipinjam',
    fine_amount DECIMAL(10, 2) DEFAULT 0, -- Denda
    
    -- Foreign Keys
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE
);

CREATE TABLE notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    type ENUM('success', 'info', 'warning', 'error') DEFAULT 'info',
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    read_status BOOLEAN DEFAULT FALSE,
    related_loan_id INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (related_loan_id) REFERENCES loans(id) ON DELETE SET NULL,
    
    INDEX idx_user_id (user_id),
    INDEX idx_read_status (read_status),
    INDEX idx_created_at (created_at)
);

ALTER TABLE loans MODIFY COLUMN status 
ENUM('pending', 'dipinjam', 'kembali', 'hilang') 
DEFAULT 'dipinjam';
-- 3. DATA DUMMY (Password sudah di-hash)

INSERT INTO users (username, password, full_name, role, class_grade) VALUES 
-- 1. Admin (Username: admin, Pass: admin123)
('admin', '$2a$12$kq.f/w.X.X.X.X.X.X.X.X.X.X.X.X.X.X.X.X.X.X.X.X.X.X', 'Administrator Utama', 'admin', NULL),

-- 2. Siswa (Username: siswa, Pass: siswa123)
('siswa', '$2a$12$kq.f/w.X.X.X.X.X.X.X.X.X.X.X.X.X.X.X.X.X.X.X.X.X.X', 'Ahmad Rizki', 'siswa', 'XII RPL 1'),

UPDATE users SET password = 'admin123' WHERE username = 'admin';
UPDATE users SET password = 'siswa123' WHERE username = 'siswa';


-- INSERT BOOKS (Sesuai dengan file gambar yang ada di /public/images/books/)
INSERT INTO books (title, author, publisher, publication_year, genre, description, image, stock) VALUES
('Laskar Pelangi', 'Andrea Hirata', 'Bentang Pustaka', 2005, 'Fiksi Inspiratif', 'Kisah perjuangan 10 anak Belitung yang bersekolah di sekolah Muhammadiyah yang hampir tutup, penuh semangat dan mimpi.', '/images/books/laskar-pelangi.jpg', 8),
('Laut Bercerita', 'Leila S. Chudori', 'Kepustakaan Populer Gramedia', 2017, 'Fiksi Sejarah', 'Mengisahkan persahabatan dan tragedi penghilangan paksa para aktivis mahasiswa menjelang reformasi 1998.', '/images/books/laut-bercerita.jpg', 6),
('Gadis Kretek', 'Ratih Kumala', 'Gramedia Pustaka Utama', 2012, 'Fiksi Sejarah', 'Penelusuran sejarah industri rokok kretek berbalut kisah cinta segitiga masa lalu yang terungkap saat pemilik pabrik sekarat.', '/images/books/gadis-kretek.jpg', 5),
('Harry Potter dan Batu Bertuah', 'J.K. Rowling', 'Gramedia Pustaka Utama', 1997, 'Fantasi', 'Awal petualangan Harry Potter yang menemukan bahwa dirinya penyihir dan masuk ke sekolah Hogwarts.', '/images/books/harry-potter.jpg', 10),
('Ancika: Dia yang Bersamaku 1995', 'Pidi Baiq', 'Pastel Books', 2020, 'Romance', 'Kisah cinta masa SMA yang penuh kenangan di tahun 1995, tentang Ancika dan perasaan yang tak terungkapkan.', '/images/books/ancika.jpg', 7),
('Funiculi Funicula', 'Toshikazu Kawaguchi', 'Gramedia Pustaka Utama', 2017, 'Fiksi Fantasi', 'Sebuah kafe di Tokyo yang memungkinkan pengunjungnya melakukan perjalanan waktu dengan aturan tertentu.', '/images/books/funiculi-funicula.jpg', 5),
('Mariposa', 'Luluk HF', 'Coconut Books', 2018, 'Romance', 'Kisah cinta remaja yang manis antara Acha dan Iqbal dengan segala dinamika persahabatan dan perasaan.', '/images/books/mariposa.jpg', 8),
('Matahari', 'Tere Liye', 'Gramedia Pustaka Utama', 2016, 'Petualangan Fantasi', 'Petualangan dunia paralel dengan kekuatan sihir, mengikuti perjalanan Matahari dan teman-temannya.', '/images/books/matahari.jpg', 6),
('Milea: Suara dari Dilan', 'Pidi Baiq', 'Pastel Books', 2016, 'Romance', 'Sudut pandang Milea tentang kisah cintanya dengan Dilan yang penuh dengan kenangan manis dan pahit.', '/images/books/milea.jpg', 9),
('Rumah untuk Alie', 'Winna Efendi', 'Gagas Media', 2012, 'Romance', 'Kisah tentang rumah warisan yang menyimpan banyak kenangan dan rahasia keluarga.', '/images/books/rumah-untuk-alie.jpg', 4),
('Senja Bersama Ayah', 'Valent Muhayar', 'Bhuana Sastra', 2020, 'Fiksi Sosial', 'Perjalanan seorang anak menemani ayahnya di saat senja kehidupan dengan penuh kasih sayang.', '/images/books/senja-bersama-ayah.jpg', 5),
('3762 MDPL', 'M. Aan Mansyur', 'Gramedia Pustaka Utama', 2018, 'Perjalanan', 'Perjalanan mendaki gunung yang juga merupakan perjalanan spiritual mencari makna kehidupan.', '/images/books/3762-mdpl.jpg', 3),
('Seporsi Mie Ayam Sebelum Mati', 'Andina Dwifatma', 'Gramedia Pustaka Utama', 2019, 'Drama', 'Cerita tentang kehidupan sederhana dengan filosofi mendalam tentang kebahagiaan.', '/images/books/seporsi-mie-ayam-sebelum-mati.jpg', 6);

-- Update image paths untuk buku yang sudah ada filenya
UPDATE books SET image = '/images/books/laskar-pelangi.jpg' WHERE title LIKE '%Laskar Pelangi%';
UPDATE books SET image = '/images/books/laut-bercerita.jpg' WHERE title LIKE '%Laut Bercerita%';
UPDATE books SET image = '/images/books/gadis-kretek.jpg' WHERE title LIKE '%Gadis Kretek%';
UPDATE books SET image = '/images/books/harry-potter.jpg' WHERE title LIKE '%Harry Potter%';
UPDATE books SET image = '/images/books/funiculi-funicula.jpg' WHERE title LIKE '%Funiculi%';
UPDATE books SET image = '/images/books/mariposa.jpg' WHERE title LIKE '%Mariposa%';
UPDATE books SET image = '/images/books/milea.jpg' WHERE title LIKE '%Milea%';
UPDATE books SET image = '/images/books/ancika.jpg' WHERE title LIKE '%Ancika%';
UPDATE books SET image = '/images/books/matahari.jpgx' WHERE title LIKE '%Matahari%';
UPDATE books SET image = '/images/books/rumah-untuk-alie.jpg' WHERE title LIKE '%Rumah untuk Alie%';
UPDATE books SET image = '/images/books/seporsi-mie-ayam-sebelum-mati.jpg' WHERE title LIKE '%Mie Ayam%';
UPDATE books SET image = '/images/books/senja-bersama-ayah.jpg' WHERE title LIKE '%Senja Bersama%';
UPDATE books SET image = '/images/books/3762-mdpl.jpg' WHERE title LIKE '%3762%';

-- Verifikasi
SELECT id, title, image FROM books WHERE image LIKE '%/images/books/%' LIMIT 10;



-- INSERT LOANS (Transaksi Peminjaman)
INSERT INTO loans (user_id, book_id, loan_date, due_date, return_date, status, fine_amount) VALUES 
-- Transaksi 1: Ahmad meminjam "Pemrograman Web" (Masih dipinjam)
(2, 3, '2025-11-01', '2025-11-08', NULL, 'dipinjam', 0),

-- Transaksi 2: Siti meminjam "Laskar Pelangi" (Sudah kembali tepat waktu)
(3, 1, '2025-10-01', '2025-10-08', '2025-10-07', 'kembali', 0),

-- Transaksi 3: Ahmad meminjam "Filosofi Teras" (Telat mengembalikan -> Kena Denda)
(2, 2, '2025-09-01', '2025-09-08', '2025-09-10', 'kembali', 10000);


SELECT * FROM users;

DELETE FROM users WHERE id = 3;