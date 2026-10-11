export class AppError extends Error {
  constructor(public status: number, public code: string, message: string) { super(message); }
}
export const forbidden = () => new AppError(403, 'FORBIDDEN', 'You do not have permission to perform this action.');
export const missing = () => new AppError(404, 'NOT_FOUND', 'This content is unavailable.');
export const invalid = (message = 'Please check the submitted fields.') => new AppError(422, 'INVALID_INPUT', message);
export function responseError(error: unknown) {
  const e = error instanceof AppError ? error : new AppError(500, 'INTERNAL', 'Something went wrong. Please try again.');
  return Response.json({ error: { code: e.code, message: e.message } }, { status: e.status, headers: { 'Cache-Control': 'private, no-store' } });
}
export function ok(data: unknown, status = 200, meta: Record<string, unknown> = {}) {
  return Response.json({ data, meta }, { status, headers: { 'Cache-Control': 'private, no-store' } });
}
