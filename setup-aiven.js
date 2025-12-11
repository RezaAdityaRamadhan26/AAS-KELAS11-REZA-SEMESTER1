// Script untuk setup database Aiven
import mysql from "mysql2/promise";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

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
    rejectUnauthorized: false, // Try false first for testing
  },
};

async function setupDatabase() {
  console.log("🔌 Connecting to Aiven MySQL...");

  try {
    const connection = await mysql.createConnection(config);
    console.log("✅ Connected successfully!");

    // Read SQL file
    const sqlFile = fs.readFileSync(
      path.join(__dirname, "db_perpustakaan_sekolah", "perpustakaan_query.sql"),
      "utf8"
    );

    // Split by semicolon and filter empty statements
    const statements = sqlFile
      .split(";")
      .map((s) => s.trim())
      .filter((s) => s.length > 0 && !s.startsWith("--"));

    console.log(`📝 Found ${statements.length} SQL statements to execute`);

    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];

      // Skip DROP/CREATE DATABASE, but execute USE and CREATE TABLE
      if (
        statement.includes("DROP DATABASE") ||
        (statement.includes("CREATE DATABASE") &&
          !statement.includes("IF NOT EXISTS"))
      ) {
        console.log(`⏭️  Skipping statement ${i + 1}: Database management`);
        continue;
      }

      // Replace database name to defaultdb
      let finalStatement = statement.replace(
        /USE\s+db_perpustakaan_sekolah/gi,
        "USE defaultdb"
      );

      try {
        await connection.query(finalStatement);
        console.log(`✅ Executed statement ${i + 1}/${statements.length}`);
      } catch (err) {
        if (!err.message.includes("already exists")) {
          console.error(`❌ Error on statement ${i + 1}:`, err.message);
          console.log("Statement:", finalStatement.substring(0, 100) + "...");
        } else {
          console.log(`⏭️  Statement ${i + 1}: Already exists, skipped`);
        }
      }
    }

    // Verify tables created
    const [tables] = await connection.query("SHOW TABLES");
    console.log("\n📊 Tables in database:");
    tables.forEach((table) => {
      console.log("  -", Object.values(table)[0]);
    });

    // Check users
    const [users] = await connection.query("SELECT username, role FROM users");
    console.log("\n👥 Users created:");
    users.forEach((user) => {
      console.log(`  - ${user.username} (${user.role})`);
    });

    await connection.end();
    console.log("\n✅ Database setup complete!");
  } catch (error) {
    console.error("❌ Error:", error.message);
    console.error("Full error:", error);
    process.exit(1);
  }
}

setupDatabase();
