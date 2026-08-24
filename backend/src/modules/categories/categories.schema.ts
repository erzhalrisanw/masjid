import { z } from 'zod';
import { TransactionType } from '@prisma/client';

export const createCategorySchema = z.object({
  name: z.string().min(2, 'Nama kategori minimal 2 karakter').max(100),
  type: z.nativeEnum(TransactionType),
  description: z.string().max(500).optional(),
});

export const updateCategorySchema = z.object({
  name: z.string().min(2).max(100).optional(),
  description: z.string().max(500).nullish(),
});

export const listCategoriesQuerySchema = z.object({
  type: z.nativeEnum(TransactionType).optional(),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
