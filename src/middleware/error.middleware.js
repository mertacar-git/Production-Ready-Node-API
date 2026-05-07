import { env } from '../config/env.js';

export function errorMiddleware(err, req, res, next) {
  if (res.headersSent) {
    next(err);
    return;
  }

  const status = err.status || err.statusCode || 500;
  const message =
    status === 500 && env.NODE_ENV === 'production'
      ? 'Internal Server Error'
      : err.message || 'Internal Server Error';

  res.status(status).json({
    error: message,
    ...(env.NODE_ENV !== 'production' && err.stack ? { stack: err.stack } : {}),
  });
}
