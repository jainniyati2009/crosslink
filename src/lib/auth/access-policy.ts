import { AppError, forbidden } from '@/lib/api-errors';
export function assertOwner(actorId: string, authorId: string) { if (actorId !== authorId) throw forbidden(); }
export function assertDiscussionOpen(discussion: { isLocked: boolean; visibility: string }) {
  if (discussion.visibility !== 'VISIBLE') throw new AppError(404, 'NOT_FOUND', 'This discussion is unavailable.');
  if (discussion.isLocked) throw new AppError(409, 'LOCKED', 'This discussion is locked.');
}
