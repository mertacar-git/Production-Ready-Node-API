import { createApp } from './app.js';
import { env } from './config/env.js';
import { initAuthStore } from './db/postgres.js';
import { createRateLimiterMiddleware } from './middleware/rateLimiter.middleware.js';
import { logger } from './utils/logger.js';

async function bootstrap() {
  await initAuthStore();
  const rateLimiter = await createRateLimiterMiddleware();
  const app = createApp(rateLimiter);

  app.listen(env.PORT, () => {
    logger.info(`Server running on port ${env.PORT}`);
  });
}

bootstrap().catch((err) => {
  logger.error(err);
  process.exit(1);
});
