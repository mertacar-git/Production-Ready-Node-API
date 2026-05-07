import { Router } from 'express';
import { health, envInfo } from '../controllers/health.controller.js';

export const healthRouter = Router();

healthRouter.get('/health', health);
healthRouter.get('/env', envInfo);
