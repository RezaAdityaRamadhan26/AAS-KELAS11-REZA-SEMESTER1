import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: process.env.DATABASE_HOST || process.env.DB_HOST || "localhost",
  port: process.env.DATABASE_PORT || 3306,
  user: process.env.DATABASE_USER || process.env.DB_USER || "root",
  password: process.env.DATABASE_PASSWORD || process.env.DB_PASSWORD || "",
  database:
    process.env.DATABASE_NAME ||
    process.env.DB_NAME ||
    "db_perpustakaan_sekolah",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export async function query(sql, params) {
  const [results] = await pool.execute(sql, params);
  return results;
}

export default pool;
