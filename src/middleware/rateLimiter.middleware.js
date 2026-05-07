import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import Redis from 'ioredis';
import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';

export async function createRateLimiterMiddleware() {
  const common = {
    windowMs: env.RATE_LIMIT_WINDOW_MS,
    max: env.RATE_LIMIT_MAX,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many requests, please try again later.' },
  };

  if (!env.REDIS_URL) {
    logger.warn('REDIS_URL not set; using in-memory rate limit store');
    return rateLimit(common);
  }

  const client = new Redis(env.REDIS_URL, {
    maxRetriesPerRequest: 3,
  });

  try {
    await client.ping();
    logger.info('Redis connected for rate limiting');
    return rateLimit({
      ...common,
      store: new RedisStore({
        sendCommand: (...args) => client.call(...args),
      }),
    });
  } catch (err) {
    logger.warn(
      'Redis unavailable for rate limiting; falling back to memory store:',
      err?.message || err
    );
    try {
      await client.quit();
    } catch {
      // ignore
    }
    return rateLimit(common);
  }
}
