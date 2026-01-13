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

const pool = mysql.createPool({
  host: process.env.DATABASE_HOST || process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DATABASE_PORT || process.env.DB_PORT || "3306"),
  user: process.env.DATABASE_USER || process.env.DB_USER || "root",
  password: process.env.DATABASE_PASSWORD || process.env.DB_PASSWORD || "",
  database: process.env.DATABASE_NAME || process.env.DB_NAME || "defaultdb",
  waitForConnections: true,
  connectionLimit: 5, // Reduced for serverless
  maxIdle: 5,
  idleTimeout: 60000, // 60 seconds
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
  connectTimeout: 10000, // 10 seconds timeout
  ...sslConfig,
});

export async function query(sql, params) {
  const [results] = await pool.execute(sql, params);
  return results;
}

export default pool;
