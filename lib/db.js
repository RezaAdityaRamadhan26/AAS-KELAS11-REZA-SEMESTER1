import mysql from "mysql2/promise";

// SSL configuration for Aiven - only if CA_CERT exists
let sslConfig = {};
if (process.env.CA_CERT && process.env.CA_CERT.includes("BEGIN CERTIFICATE")) {
  sslConfig = {
    ssl: {
      ca: process.env.CA_CERT,
      rejectUnauthorized: true,
    },
  };
}

// Serverless-optimized pool configuration
const pool = mysql.createPool({
  host: process.env.DATABASE_HOST || process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DATABASE_PORT || process.env.DB_PORT || "3306"),
  user: process.env.DATABASE_USER || process.env.DB_USER || "root",
  password: process.env.DATABASE_PASSWORD || process.env.DB_PASSWORD || "",
  database: process.env.DATABASE_NAME || process.env.DB_NAME || "defaultdb",
  waitForConnections: true,
  connectionLimit: 3, // Minimal for serverless (reduced from 5)
  maxIdle: 2, // Keep 2 connections idle
  idleTimeout: 30000, // 30 seconds (reduced from 60)
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
  connectTimeout: 5000, // 5 seconds timeout (reduced from 10)
  namedPlaceholders: true,
  ...sslConfig,
});

export async function query(sql, params) {
  const [results] = await pool.execute(sql, params);
  return results;
}

export default pool;
