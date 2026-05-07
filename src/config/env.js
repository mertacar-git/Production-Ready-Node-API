import dotenv from 'dotenv';

dotenv.config();

const DEFAULT_JWT_SECRET = 'dev-secret-change-me-use-env-example-for-production';

function parseNumber(value, fallback) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

export const env = {
  PORT: parseNumber(process.env.PORT, 3000),
  NODE_ENV: process.env.NODE_ENV || 'development',
  JWT_SECRET: process.env.JWT_SECRET || DEFAULT_JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1d',
  DATABASE_URL: process.env.DATABASE_URL?.trim() || '',
  REDIS_URL: process.env.REDIS_URL?.trim() || '',
  RATE_LIMIT_WINDOW_MS: parseNumber(process.env.RATE_LIMIT_WINDOW_MS, 15 * 60 * 1000),
  RATE_LIMIT_MAX: parseNumber(process.env.RATE_LIMIT_MAX, 100),
};

if (env.NODE_ENV === 'production') {
  if (!process.env.JWT_SECRET || env.JWT_SECRET === DEFAULT_JWT_SECRET) {
    throw new Error(
      'JWT_SECRET must be set to a strong unique value when NODE_ENV=production'
    );
  }
}
