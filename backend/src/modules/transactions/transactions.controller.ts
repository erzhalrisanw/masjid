import { Router } from 'express';
import { Role } from '@prisma/client';
import { authenticate, authorize } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import {
  createTransactionSchema,
  listTransactionsQuerySchema,
  reportQuerySchema,
  updateTransactionSchema,
} from './transactions.schema.js';
import * as service from './transactions.service.js';

export const transactionsRouter = Router();
transactionsRouter.use(authenticate);

transactionsRouter.get('/summary', async (_req, res, next) => {
  try {
    const data = await service.summary();
    res.json(data);
  } catch (e) {
    next(e);
  }
});

transactionsRouter.get(
  '/report',
  validate(reportQuerySchema, 'query'),
  async (req, res, next) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data = await service.monthlyReport(req.query as any);
      res.json(data);
    } catch (e) {
      next(e);
    }
  },
);

transactionsRouter.get(
  '/',
  validate(listTransactionsQuerySchema, 'query'),
  async (req, res, next) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data = await service.list(req.query as any);
      res.json(data);
    } catch (e) {
      next(e);
    }
  },
);

transactionsRouter.get('/:id', async (req, res, next) => {
  try {
    const transaction = await service.getById(String(req.params.id));
    res.json({ transaction });
  } catch (e) {
    next(e);
  }
});

transactionsRouter.post(
  '/',
  authorize(Role.SUPER_ADMIN, Role.BENDAHARA),
  validate(createTransactionSchema),
  async (req, res, next) => {
    try {
      const transaction = await service.create(req.body, req.user!.id);
      res.status(201).json({ transaction });
    } catch (e) {
      next(e);
    }
  },
);

transactionsRouter.patch(
  '/:id',
  authorize(Role.SUPER_ADMIN, Role.BENDAHARA),
  validate(updateTransactionSchema),
  async (req, res, next) => {
    try {
      const transaction = await service.update(String(req.params.id), req.body);
      res.json({ transaction });
    } catch (e) {
      next(e);
    }
  },
);

transactionsRouter.delete(
  '/:id',
  authorize(Role.SUPER_ADMIN, Role.BENDAHARA),
  async (req, res, next) => {
    try {
      await service.remove(String(req.params.id));
      res.json({ message: 'Transaksi berhasil dihapus' });
    } catch (e) {
      next(e);
    }
  },
);
