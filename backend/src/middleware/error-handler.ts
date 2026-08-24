import { NextFunction, Request, Response } from 'express';
import { HttpError } from '../lib/http-error.js';

export const notFoundHandler = (_req: Request, res: Response) => {
  res.status(404).json({
    error: { code: 'NOT_FOUND', message: 'Endpoint tidak ditemukan' },
  });
};

export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (err instanceof HttpError) {
    return res.status(err.status).json({
      error: { code: err.code ?? 'ERROR', message: err.message, details: err.details },
    });
  }

  console.error('[Unhandled error]', err);
  res.status(500).json({
    error: { code: 'INTERNAL_ERROR', message: 'Terjadi kesalahan pada server' },
  });
};
