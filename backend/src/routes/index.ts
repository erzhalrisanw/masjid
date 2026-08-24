import { Router } from 'express';
import { authRouter } from '../modules/auth/auth.controller.js';
import { usersRouter } from '../modules/users/users.controller.js';
import { categoriesRouter } from '../modules/categories/categories.controller.js';
import { transactionsRouter } from '../modules/transactions/transactions.controller.js';

export const apiRouter = Router();

apiRouter.get('/health', (_req, res) =>
  res.json({ status: 'ok', service: 'masjid-sayyidina-abubakar-api' }),
);

apiRouter.use('/auth', authRouter);
apiRouter.use('/users', usersRouter);
apiRouter.use('/categories', categoriesRouter);
apiRouter.use('/transactions', transactionsRouter);
