// Script untuk setup database Aiven - Simplified
import mysql from "mysql2/promise";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcryptjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const config = {
  host: process.env.DB_HOST || "your-aiven-host.aivencloud.com",
  port: parseInt(process.env.DB_PORT) || 24251,
  user: process.env.DB_USER || "avnadmin",
  password: process.env.DB_PASSWORD || "your-password",
  database: process.env.DB_NAME || "defaultdb",
  connectTimeout: 30000,
  ssl: {
    ca: fs.readFileSync(path.join(__dirname, "ca.pem")).toString(),
    rejectUnauthorized: false,
  },
};

async function setupDatabase() {
  console.log("🔌 Connecting to Aiven MySQL...");

  try {
    const connection = await mysql.createConnection(config);
    console.log("✅ Connected successfully!\n");

    // Create tables
    console.log("📝 Creating tables...");

    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        full_name VARCHAR(100) NOT NULL,
        role ENUM('admin', 'siswa') NOT NULL,
        class_grade VARCHAR(20) NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("✅ Table 'users' created");

    await connection.query(`
      CREATE TABLE IF NOT EXISTS books (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        author VARCHAR(100) NOT NULL,
        publisher VARCHAR(100) NOT NULL,
        publication_year INT NOT NULL,
        genre VARCHAR(50) NOT NULL,
        description TEXT,
        image VARCHAR(255),
        stock INT DEFAULT 10,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("✅ Table 'books' created");

    await connection.query(`
      CREATE TABLE IF NOT EXISTS loans (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        book_id INT NOT NULL,
        loan_date DATE NOT NULL,
        due_date DATE NOT NULL,
        return_date DATE NULL,
        status ENUM('pending', 'dipinjam', 'kembali', 'hilang') DEFAULT 'dipinjam',
        fine_amount DECIMAL(10, 2) DEFAULT 0,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE
      )
    `);
    console.log("✅ Table 'loans' created");

    await connection.query(`
      CREATE TABLE IF NOT EXISTS notifications (
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
      )
    `);
    console.log("✅ Table 'notifications' created\n");

    // Insert default users
    console.log("👥 Creating default users...");

    const adminPassword = await bcrypt.hash("admin123", 10);
    const siswaPassword = await bcrypt.hash("siswa123", 10);

    try {
      await connection.query(
        "INSERT INTO users (username, password, full_name, role, class_grade) VALUES (?, ?, ?, ?, ?)",
        ["admin", adminPassword, "Administrator Utama", "admin", null]
      );
      console.log("✅ Admin user created");
    } catch (e) {
      if (e.code === "ER_DUP_ENTRY") {
        console.log("⏭️  Admin user already exists");
      }
    }

    try {
      await connection.query(
        "INSERT INTO users (username, password, full_name, role, class_grade) VALUES (?, ?, ?, ?, ?)",
        ["siswa", siswaPassword, "Ahmad Rizki", "siswa", "XII RPL 1"]
      );
      console.log("✅ Siswa user created\n");
    } catch (e) {
      if (e.code === "ER_DUP_ENTRY") {
        console.log("⏭️  Siswa user already exists\n");
      }
    }

    // Insert books
    console.log("📚 Inserting books...");
    const books = [
      [
        "Laskar Pelangi",
        "Andrea Hirata",
        "Bentang Pustaka",
        2005,
        "Fiksi Inspiratif",
        "Kisah perjuangan 10 anak Belitung yang bersekolah di sekolah Muhammadiyah",
        "/images/books/laskar-pelangi.jpg",
        8,
      ],
      [
        "Laut Bercerita",
        "Leila S. Chudori",
        "Kepustakaan Populer Gramedia",
        2017,
        "Fiksi Sejarah",
        "Mengisahkan persahabatan dan tragedi penghilangan paksa para aktivis",
        "/images/books/laut-bercerita.jpg",
        6,
      ],
      [
        "Gadis Kretek",
        "Ratih Kumala",
        "Gramedia Pustaka Utama",
        2012,
        "Fiksi Sejarah",
        "Penelusuran sejarah industri rokok kretek berbalut kisah cinta",
        "/images/books/gadis-kretek.jpg",
        5,
      ],
      [
        "Harry Potter dan Batu Bertuah",
        "J.K. Rowling",
        "Gramedia Pustaka Utama",
        1997,
        "Fantasi",
        "Awal petualangan Harry Potter yang menemukan bahwa dirinya penyihir",
        "/images/books/harry-potter.jpg",
        10,
      ],
      [
        "Ancika: Dia yang Bersamaku 1995",
        "Pidi Baiq",
        "Pastel Books",
        2020,
        "Romance",
        "Kisah cinta masa SMA yang penuh kenangan di tahun 1995",
        "/images/books/ancika.jpg",
        7,
      ],
    ];

    for (const book of books) {
      try {
        await connection.query(
          "INSERT INTO books (title, author, publisher, publication_year, genre, description, image, stock) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
          book
        );
        console.log(`✅ Book added: ${book[0]}`);
      } catch (e) {
        if (e.code === "ER_DUP_ENTRY") {
          console.log(`⏭️  Book already exists: ${book[0]}`);
        }
      }
    }

    // Verify
    const [tables] = await connection.query("SHOW TABLES");
    console.log("\n📊 Tables in database:");
    tables.forEach((table) => {
      console.log("  -", Object.values(table)[0]);
    });

    const [users] = await connection.query("SELECT username, role FROM users");
    console.log("\n👥 Users in database:");
    users.forEach((user) => {
      console.log(`  - ${user.username} (${user.role})`);
    });

    const [booksCount] = await connection.query(
      "SELECT COUNT(*) as count FROM books"
    );
    console.log(`\n📚 Total books: ${booksCount[0].count}`);

    await connection.end();
    console.log("\n✅ Database setup complete!");
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

setupDatabase();
