import { Router } from 'express';
import { validate } from '../../middleware/validate.js';
import { authenticate } from '../../middleware/auth.js';
import { loginSchema, refreshSchema, registerSchema } from './auth.schema.js';
import * as service from './auth.service.js';

export const authRouter = Router();

authRouter.post('/register', validate(registerSchema), async (req, res, next) => {
  try {
    const result = await service.register(req.body);
    res.status(201).json(result);
  } catch (e) {
    next(e);
  }
});

authRouter.post('/login', validate(loginSchema), async (req, res, next) => {
  try {
    const result = await service.login(req.body);
    res.json(result);
  } catch (e) {
    next(e);
  }
});

authRouter.post('/refresh', validate(refreshSchema), async (req, res, next) => {
  try {
    const result = await service.refresh(req.body.refreshToken);
    res.json(result);
  } catch (e) {
    next(e);
  }
});

authRouter.post('/logout', validate(refreshSchema), async (req, res, next) => {
  try {
    await service.logout(req.body.refreshToken);
    res.json({ message: 'Berhasil logout' });
  } catch (e) {
    next(e);
  }
});

authRouter.get('/me', authenticate, async (req, res, next) => {
  try {
    const user = await service.me(req.user!.id);
    res.json({ user });
  } catch (e) {
    next(e);
  }
});
