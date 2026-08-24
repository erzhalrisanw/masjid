import bcrypt from 'bcryptjs';
import { Role } from '@prisma/client';
import { prisma } from '../../lib/prisma.js';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../../lib/jwt.js';
import { conflict, unauthorized } from '../../lib/http-error.js';
import type { LoginInput, RegisterInput } from './auth.schema.js';

const REFRESH_TTL_MS = 7 * 24 * 60 * 60 * 1000;

const toAuthResponse = (user: { id: string; name: string; email: string; role: Role }) => {
  const accessToken = signAccessToken({ sub: user.id, role: user.role, email: user.email });
  const refreshToken = signRefreshToken({ sub: user.id });
  return { user, accessToken, refreshToken };
};

export const register = async (input: RegisterInput) => {
  const exists = await prisma.user.findUnique({ where: { email: input.email } });
  if (exists) throw conflict('Email sudah terdaftar');

  const passwordHash = await bcrypt.hash(input.password, 10);
  const user = await prisma.user.create({
    data: {
      name: input.name,
      email: input.email,
      passwordHash,
      phone: input.phone,
      role: Role.JAMAAH,
    },
    select: { id: true, name: true, email: true, role: true },
  });

  const result = toAuthResponse(user);
  await prisma.refreshToken.create({
    data: {
      token: result.refreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + REFRESH_TTL_MS),
    },
  });
  return result;
};

export const login = async (input: LoginInput) => {
  const user = await prisma.user.findUnique({ where: { email: input.email } });
  if (!user || !user.isActive) throw unauthorized('Email atau password salah');
  const ok = await bcrypt.compare(input.password, user.passwordHash);
  if (!ok) throw unauthorized('Email atau password salah');

  const result = toAuthResponse({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  });
  await prisma.refreshToken.create({
    data: {
      token: result.refreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + REFRESH_TTL_MS),
    },
  });
  return result;
};

export const refresh = async (refreshToken: string) => {
  let payload: { sub: string };
  try {
    payload = verifyRefreshToken(refreshToken);
  } catch {
    throw unauthorized('Refresh token tidak valid');
  }

  const stored = await prisma.refreshToken.findUnique({ where: { token: refreshToken } });
  if (!stored || stored.expiresAt < new Date())
    throw unauthorized('Refresh token kadaluarsa');

  const user = await prisma.user.findUnique({ where: { id: payload.sub } });
  if (!user || !user.isActive) throw unauthorized('Pengguna tidak ditemukan');

  await prisma.refreshToken.delete({ where: { id: stored.id } });
  const result = toAuthResponse({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  });
  await prisma.refreshToken.create({
    data: {
      token: result.refreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + REFRESH_TTL_MS),
    },
  });
  return result;
};

export const logout = async (refreshToken: string) => {
  await prisma.refreshToken.deleteMany({ where: { token: refreshToken } });
};

export const me = async (userId: string) =>
  prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true, phone: true, role: true, isActive: true },
  });
