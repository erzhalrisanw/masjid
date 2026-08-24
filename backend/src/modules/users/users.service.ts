import bcrypt from 'bcryptjs';
import { Prisma } from '@prisma/client';
import { prisma } from '../../lib/prisma.js';
import { conflict, notFound } from '../../lib/http-error.js';
import type { CreateUserInput, ListUsersQuery, UpdateUserInput } from './users.schema.js';

const publicSelect = {
  id: true,
  name: true,
  email: true,
  phone: true,
  role: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
};

export const list = async (query: ListUsersQuery) => {
  const where: Prisma.UserWhereInput = {
    ...(query.role && { role: query.role }),
    ...(query.search && {
      OR: [
        { name: { contains: query.search, mode: 'insensitive' } },
        { email: { contains: query.search, mode: 'insensitive' } },
      ],
    }),
  };

  const [total, data] = await Promise.all([
    prisma.user.count({ where }),
    prisma.user.findMany({
      where,
      select: publicSelect,
      orderBy: { createdAt: 'desc' },
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
  const user = await prisma.user.findUnique({ where: { id }, select: publicSelect });
  if (!user) throw notFound('Pengguna tidak ditemukan');
  return user;
};

export const create = async (input: CreateUserInput) => {
  const exists = await prisma.user.findUnique({ where: { email: input.email } });
  if (exists) throw conflict('Email sudah terdaftar');
  const passwordHash = await bcrypt.hash(input.password, 10);
  return prisma.user.create({
    data: {
      name: input.name,
      email: input.email,
      passwordHash,
      phone: input.phone,
      role: input.role,
    },
    select: publicSelect,
  });
};

export const update = async (id: string, input: UpdateUserInput) => {
  const data: Prisma.UserUpdateInput = {
    name: input.name,
    phone: input.phone,
    role: input.role,
    isActive: input.isActive,
  };
  if (input.password) data.passwordHash = await bcrypt.hash(input.password, 10);

  try {
    return await prisma.user.update({ where: { id }, data, select: publicSelect });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2025') {
      throw notFound('Pengguna tidak ditemukan');
    }
    throw e;
  }
};

export const remove = async (id: string) => {
  try {
    await prisma.user.delete({ where: { id } });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2025') {
      throw notFound('Pengguna tidak ditemukan');
    }
    throw e;
  }
};
