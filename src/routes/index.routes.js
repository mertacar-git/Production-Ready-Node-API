import { Router } from 'express';
import { root } from '../controllers/health.controller.js';

export const indexRouter = Router();

indexRouter.get('/', root);
