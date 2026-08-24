import { Prisma, TransactionType } from '@prisma/client';
import { prisma } from '../../lib/prisma.js';
import { badRequest, notFound } from '../../lib/http-error.js';
import type {
  CreateTransactionInput,
  ListTransactionsQuery,
  ReportQuery,
  UpdateTransactionInput,
} from './transactions.schema.js';

const includeRelations = {
  category: { select: { id: true, name: true, type: true } },
  createdBy: { select: { id: true, name: true } },
};

const assertCategoryMatch = async (categoryId: string, type?: TransactionType) => {
  const category = await prisma.category.findUnique({ where: { id: categoryId } });
  if (!category) throw badRequest('Kategori tidak ditemukan');
  if (type && category.type !== type)
    throw badRequest('Tipe kategori tidak sesuai dengan tipe transaksi');
  return category;
};

export const list = async (query: ListTransactionsQuery) => {
  const where: Prisma.TransactionWhereInput = {
    ...(query.type && { type: query.type }),
    ...(query.categoryId && { categoryId: query.categoryId }),
    ...((query.startDate || query.endDate) && {
      date: {
        ...(query.startDate && { gte: query.startDate }),
        ...(query.endDate && { lte: query.endDate }),
      },
    }),
    ...(query.search && {
      OR: [
        { description: { contains: query.search, mode: 'insensitive' } },
        { reference: { contains: query.search, mode: 'insensitive' } },
      ],
    }),
  };

  const [total, data] = await Promise.all([
    prisma.transaction.count({ where }),
    prisma.transaction.findMany({
      where,
      include: includeRelations,
      orderBy: { date: 'desc' },
      skip: (query.page - 1) * query.pageSize,
      take: query.pageSize,
    }),
  ]);

  return {
    data,
    meta: {
      page: query.page,
      pageSize: query.pageSize,
      total,
      totalPages: Math.ceil(total / query.pageSize),
    },
  };
};

export const getById = async (id: string) => {
  const trx = await prisma.transaction.findUnique({
    where: { id },
    include: includeRelations,
  });
  if (!trx) throw notFound('Transaksi tidak ditemukan');
  return trx;
};

export const create = async (input: CreateTransactionInput, userId: string) => {
  await assertCategoryMatch(input.categoryId, input.type);
  return prisma.transaction.create({
    data: {
      type: input.type,
      amount: input.amount,
      categoryId: input.categoryId,
      date: input.date ?? new Date(),
      description: input.description,
      reference: input.reference,
      createdById: userId,
    },
    include: includeRelations,
  });
};

export const update = async (id: string, input: UpdateTransactionInput) => {
  const existing = await prisma.transaction.findUnique({ where: { id } });
  if (!existing) throw notFound('Transaksi tidak ditemukan');
  if (input.categoryId) await assertCategoryMatch(input.categoryId, existing.type);

  return prisma.transaction.update({
    where: { id },
    data: input,
    include: includeRelations,
  });
};

export const remove = async (id: string) => {
  try {
    await prisma.transaction.delete({ where: { id } });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2025') {
      throw notFound('Transaksi tidak ditemukan');
    }
    throw e;
  }
};

export const summary = async () => {
  const grouped = await prisma.transaction.groupBy({
    by: ['type'],
    _sum: { amount: true },
  });

  const totalIncome =
    grouped.find((g) => g.type === TransactionType.PEMASUKAN)?._sum.amount ?? 0;
  const totalExpense =
    grouped.find((g) => g.type === TransactionType.PENGELUARAN)?._sum.amount ?? 0;
  const balance = Number(totalIncome) - Number(totalExpense);

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

  const monthly = await prisma.transaction.groupBy({
    by: ['type'],
    where: { date: { gte: startOfMonth, lte: endOfMonth } },
    _sum: { amount: true },
  });

  const monthIncome =
    monthly.find((g) => g.type === TransactionType.PEMASUKAN)?._sum.amount ?? 0;
  const monthExpense =
    monthly.find((g) => g.type === TransactionType.PENGELUARAN)?._sum.amount ?? 0;

  return {
    totalIncome: Number(totalIncome),
    totalExpense: Number(totalExpense),
    balance,
    thisMonth: {
      income: Number(monthIncome),
      expense: Number(monthExpense),
      net: Number(monthIncome) - Number(monthExpense),
    },
  };
};

export const monthlyReport = async ({ year, month }: ReportQuery) => {
  if (month) {
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0, 23, 59, 59);
    const byCategory = await prisma.transaction.groupBy({
      by: ['categoryId', 'type'],
      where: { date: { gte: start, lte: end } },
      _sum: { amount: true },
    });
    const categories = await prisma.category.findMany({
      where: { id: { in: byCategory.map((b) => b.categoryId) } },
    });
    const catMap = new Map(categories.map((c) => [c.id, c]));
    const rows = byCategory.map((b) => ({
      categoryId: b.categoryId,
      categoryName: catMap.get(b.categoryId)?.name ?? '-',
      type: b.type,
      total: Number(b._sum.amount ?? 0),
    }));
    const income = rows
      .filter((r) => r.type === TransactionType.PEMASUKAN)
      .reduce((s, r) => s + r.total, 0);
    const expense = rows
      .filter((r) => r.type === TransactionType.PENGELUARAN)
      .reduce((s, r) => s + r.total, 0);
    return { year, month, rows, income, expense, net: income - expense };
  }

  const start = new Date(year, 0, 1);
  const end = new Date(year, 11, 31, 23, 59, 59);
  const trxs = await prisma.transaction.findMany({
    where: { date: { gte: start, lte: end } },
    select: { type: true, amount: true, date: true },
  });
  const months = Array.from({ length: 12 }, (_, i) => ({
    month: i + 1,
    income: 0,
    expense: 0,
    net: 0,
  }));
  for (const t of trxs) {
    const idx = t.date.getMonth();
    const amt = Number(t.amount);
    if (t.type === TransactionType.PEMASUKAN) months[idx].income += amt;
    else months[idx].expense += amt;
    months[idx].net = months[idx].income - months[idx].expense;
  }
  return { year, months };
};
