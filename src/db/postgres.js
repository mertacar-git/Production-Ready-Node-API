import { Pool } from 'pg';
import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';

let pool;
const memoryUsers = new Map();

function getPool() {
  if (!env.DATABASE_URL) return null;
  if (!pool) {
    pool = new Pool({
      connectionString: env.DATABASE_URL,
    });
  }
  return pool;
}

export async function initAuthStore() {
  const db = getPool();
  if (!db) {
    logger.warn('DATABASE_URL not set; auth will use in-memory storage');
    return;
  }

  await db.query(`
    CREATE TABLE IF NOT EXISTS users (
      email TEXT PRIMARY KEY,
      password_hash TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
  logger.info('PostgreSQL auth store is ready');
}

export async function findUserByEmail(email) {
  const db = getPool();
  if (!db) {
    return memoryUsers.get(email) || null;
  }
  const result = await db.query(
    'SELECT email, password_hash FROM users WHERE email = $1',
    [email]
  );
  return result.rows[0] || null;
}

export async function insertUser(email, passwordHash) {
  const db = getPool();
  if (!db) {
    if (memoryUsers.has(email)) return false;
    memoryUsers.set(email, { email, password_hash: passwordHash });
    return true;
  }

  const result = await db.query(
    `INSERT INTO users (email, password_hash)
     VALUES ($1, $2)
     ON CONFLICT (email) DO NOTHING`,
    [email, passwordHash]
  );
  return result.rowCount === 1;
}
