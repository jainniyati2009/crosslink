import 'server-only';
import { AppError } from './api-errors';
export async function mutationBody(request: Request): Promise<unknown> {
  if (!process.env.APP_ORIGIN || request.headers.get('origin') !== process.env.APP_ORIGIN) throw new AppError(403, 'BAD_ORIGIN', 'This request came from an untrusted origin.');
  if (!request.headers.get('content-type')?.toLowerCase().startsWith('application/json')) throw new AppError(422, 'CONTENT_TYPE', 'Send JSON content.');
  try { return await request.json(); } catch { throw new AppError(422, 'INVALID_JSON', 'Invalid JSON content.'); }
}
