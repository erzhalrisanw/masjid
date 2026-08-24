import { z } from 'zod';
import { TransactionType } from '@prisma/client';

export const createTransactionSchema = z.object({
  type: z.nativeEnum(TransactionType),
  amount: z.coerce.number().positive('Jumlah harus lebih dari 0'),
  categoryId: z.string().min(1, 'Kategori wajib dipilih'),
  date: z.coerce.date().optional(),
  description: z.string().max(500).optional(),
  reference: z.string().max(100).optional(),
});

export const updateTransactionSchema = z.object({
  amount: z.coerce.number().positive().optional(),
  categoryId: z.string().min(1).optional(),
  date: z.coerce.date().optional(),
  description: z.string().max(500).nullish(),
  reference: z.string().max(100).nullish(),
});

export const listTransactionsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  type: z.nativeEnum(TransactionType).optional(),
  categoryId: z.string().optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  search: z.string().optional(),
});

export const reportQuerySchema = z.object({
  year: z.coerce.number().int().min(2000).max(2100),
  month: z.coerce.number().int().min(1).max(12).optional(),
});

export type CreateTransactionInput = z.infer<typeof createTransactionSchema>;
export type UpdateTransactionInput = z.infer<typeof updateTransactionSchema>;
export type ListTransactionsQuery = z.infer<typeof listTransactionsQuerySchema>;
export type ReportQuery = z.infer<typeof reportQuerySchema>;
