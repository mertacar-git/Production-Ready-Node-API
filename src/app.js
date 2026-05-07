import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { env } from './config/env.js';
import { indexRouter } from './routes/index.routes.js';
import { healthRouter } from './routes/health.routes.js';
import { authRouter, userRouter } from './routes/auth.routes.js';
import { errorMiddleware } from './middleware/error.middleware.js';

/**
 * @param {import('express').RequestHandler} rateLimiter
 */
export function createApp(rateLimiter) {
  const app = express();
  const __dirname = dirname(fileURLToPath(import.meta.url));
  const publicDir = join(__dirname, '..', 'public');

  app.use(helmet());
  app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'));
  app.use(express.json());
  app.use('/ui', express.static(join(publicDir, 'ui')));
  app.use(rateLimiter);

  app.use('/', indexRouter);
  app.use('/', healthRouter);
  app.use('/auth', authRouter);
  app.use('/', userRouter);

  app.use((req, res) => {
    res.status(404).json({ error: 'Not Found' });
  });

  app.use(errorMiddleware);

  return app;
}
