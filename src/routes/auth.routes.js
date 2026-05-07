import { Router } from 'express';
import {
  register,
  login,
  me,
  registerPage,
  loginPage,
} from '../controllers/auth.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

export const authRouter = Router();

authRouter.get('/register', registerPage);
authRouter.get('/login', loginPage);
authRouter.post('/register', register);
authRouter.post('/login', login);

export const userRouter = Router();

userRouter.get('/me', authMiddleware, me);
