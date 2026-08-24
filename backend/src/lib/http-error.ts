export class HttpError extends Error {
  status: number;
  code?: string;
  details?: unknown;

  constructor(status: number, message: string, code?: string, details?: unknown) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export const badRequest = (msg = 'Permintaan tidak valid', details?: unknown) =>
  new HttpError(400, msg, 'BAD_REQUEST', details);
export const unauthorized = (msg = 'Tidak terautentikasi') =>
  new HttpError(401, msg, 'UNAUTHORIZED');
export const forbidden = (msg = 'Akses ditolak') => new HttpError(403, msg, 'FORBIDDEN');
export const notFound = (msg = 'Data tidak ditemukan') => new HttpError(404, msg, 'NOT_FOUND');
export const conflict = (msg = 'Data sudah ada') => new HttpError(409, msg, 'CONFLICT');
