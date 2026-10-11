import 'server-only';
import { db } from './db';
import { AppError } from './api-errors';
export async function rateLimit(key: string, limit = 10, windowMs = 60_000) {
  const now = new Date();
  const resetsAt = new Date(now.getTime() + windowMs);
  const record = await db.$transaction(async tx => {
    const existing = await tx.rateLimit.findUnique({ where: { key } });
    if (!existing || existing.resetsAt <= now) return tx.rateLimit.upsert({ where: { key }, create: { key, count: 1, resetsAt }, update: { count: 1, resetsAt } });
    return tx.rateLimit.update({ where: { key }, data: { count: { increment: 1 } } });
  });
  if (record.count > limit) throw new AppError(429, 'RATE_LIMITED', 'Please wait before trying again.');
}
