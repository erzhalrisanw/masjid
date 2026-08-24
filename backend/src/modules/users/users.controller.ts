import { Router } from 'express';
import { Role } from '@prisma/client';
import { authenticate, authorize } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import {
  createUserSchema,
  listUsersQuerySchema,
  updateUserSchema,
} from './users.schema.js';
import * as service from './users.service.js';

export const usersRouter = Router();

usersRouter.use(authenticate);

usersRouter.get(
  '/',
  authorize(Role.SUPER_ADMIN, Role.PENGURUS),
  validate(listUsersQuerySchema, 'query'),
  async (req, res, next) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = await service.list(req.query as any);
      res.json(result);
    } catch (e) {
      next(e);
    }
  },
);

usersRouter.get(
  '/:id',
  authorize(Role.SUPER_ADMIN, Role.PENGURUS),
  async (req, res, next) => {
    try {
      const user = await service.getById(String(req.params.id));
      res.json({ user });
    } catch (e) {
      next(e);
    }
  },
);

usersRouter.post(
  '/',
  authorize(Role.SUPER_ADMIN),
  validate(createUserSchema),
  async (req, res, next) => {
    try {
      const user = await service.create(req.body);
      res.status(201).json({ user });
    } catch (e) {
      next(e);
    }
  },
);

usersRouter.patch(
  '/:id',
  authorize(Role.SUPER_ADMIN),
  validate(updateUserSchema),
  async (req, res, next) => {
    try {
      const user = await service.update(String(req.params.id), req.body);
      res.json({ user });
    } catch (e) {
      next(e);
    }
  },
);

usersRouter.delete('/:id', authorize(Role.SUPER_ADMIN), async (req, res, next) => {
  try {
    await service.remove(String(req.params.id));
    res.json({ message: 'Pengguna berhasil dihapus' });
  } catch (e) {
    next(e);
  }
});
