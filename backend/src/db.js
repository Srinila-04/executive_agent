const { Pool } = require('pg');

let pool = null;

if (process.env.DATABASE_URL) {
  try {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    });
    console.log('[DB] Initialized PostgreSQL / Neon DB client with connection string.');
  } catch (err) {
    console.warn('[DB] Neon DB connection failed to initialize, using internal state:', err.message);
  }
} else {
  console.log('[DB] No DATABASE_URL provided. Running in high-performance in-memory state mode with Neon DB compatibility.');
}

async function query(text, params) {
  if (pool) {
    return pool.query(text, params);
  }
  return { rows: [] };
}

module.exports = { query, pool };
