import { NextFunction, Request, Response } from 'express';
import { Role } from '@prisma/client';
import { verifyAccessToken } from '../lib/jwt.js';
import { forbidden, unauthorized } from '../lib/http-error.js';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: { id: string; role: Role; email: string };
    }
  }
}

export const authenticate = (req: Request, _res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) return next(unauthorized('Token tidak ditemukan'));
  const token = header.slice(7);
  try {
    const payload = verifyAccessToken(token);
    req.user = { id: payload.sub, role: payload.role as Role, email: payload.email };
    next();
  } catch {
    next(unauthorized('Token tidak valid atau kadaluarsa'));
  }
};

export const authorize =
  (...allowedRoles: Role[]) =>
  (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) return next(unauthorized());
    if (!allowedRoles.includes(req.user.role))
      return next(forbidden('Anda tidak memiliki izin untuk aksi ini'));
    next();
  };
