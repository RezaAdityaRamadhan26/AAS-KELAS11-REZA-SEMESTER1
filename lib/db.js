import mysql from "mysql2/promise";
import fs from "fs";
import path from "path";

// SSL configuration for Aiven
const sslConfig = process.env.DB_HOST
  ? {
      ssl: {
        ca:
          process.env.CA_CERT ||
          fs.readFileSync(path.join(process.cwd(), "ca.pem")).toString(),
        rejectUnauthorized: true,
      },
    }
  : {};

const pool = mysql.createPool({
  host: process.env.DATABASE_HOST || process.env.DB_HOST || "localhost",
  port: process.env.DATABASE_PORT || process.env.DB_PORT || 3306,
  user: process.env.DATABASE_USER || process.env.DB_USER || "root",
  password: process.env.DATABASE_PASSWORD || process.env.DB_PASSWORD || "",
  database:
    process.env.DATABASE_NAME ||
    process.env.DB_NAME ||
    "db_perpustakaan_sekolah",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ...sslConfig,
});

export async function query(sql, params) {
  const [results] = await pool.execute(sql, params);
  return results;
}

export default pool;
