import { Router } from 'express';
import { Prisma, Role, TransactionType } from '@prisma/client';
import { prisma } from '../../lib/prisma.js';
import { authenticate, authorize } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import { conflict, notFound } from '../../lib/http-error.js';
import {
  createCategorySchema,
  listCategoriesQuerySchema,
  updateCategorySchema,
} from './categories.schema.js';

export const categoriesRouter = Router();
categoriesRouter.use(authenticate);

categoriesRouter.get(
  '/',
  validate(listCategoriesQuerySchema, 'query'),
  async (req, res, next) => {
    try {
      const type = (req.query as { type?: TransactionType }).type;
      const data = await prisma.category.findMany({
        where: type ? { type } : undefined,
        orderBy: [{ type: 'asc' }, { name: 'asc' }],
      });
      res.json({ data });
    } catch (e) {
      next(e);
    }
  },
);

categoriesRouter.post(
  '/',
  authorize(Role.SUPER_ADMIN, Role.BENDAHARA),
  validate(createCategorySchema),
  async (req, res, next) => {
    try {
      const category = await prisma.category.create({ data: req.body });
      res.status(201).json({ category });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
        return next(conflict('Kategori dengan nama & tipe tersebut sudah ada'));
      }
      next(e);
    }
  },
);

categoriesRouter.patch(
  '/:id',
  authorize(Role.SUPER_ADMIN, Role.BENDAHARA),
  validate(updateCategorySchema),
  async (req, res, next) => {
    try {
      const category = await prisma.category.update({
        where: { id: String(req.params.id) },
        data: req.body,
      });
      res.json({ category });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2025') {
        return next(notFound('Kategori tidak ditemukan'));
      }
      next(e);
    }
  },
);

categoriesRouter.delete(
  '/:id',
  authorize(Role.SUPER_ADMIN),
  async (req, res, next) => {
    try {
      await prisma.category.delete({ where: { id: String(req.params.id) } });
      res.json({ message: 'Kategori berhasil dihapus' });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2025') return next(notFound('Kategori tidak ditemukan'));
        if (e.code === 'P2003')
          return next(conflict('Kategori masih dipakai oleh transaksi'));
      }
      next(e);
    }
  },
);
