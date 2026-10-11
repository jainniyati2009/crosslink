import 'server-only';
import { db } from '@/lib/db';
import { missing } from '@/lib/api-errors';
import { z } from 'zod';
import { assertAdminActor } from '@/lib/auth/service-policy.server';
const discussionAction = z.object({ visibility: z.enum(['VISIBLE', 'HIDDEN']).optional(), isLocked: z.boolean().optional(), reason: z.string().trim().min(3).max(500) }).strict().refine(x => x.visibility !== undefined || x.isLocked !== undefined);
const replyAction = z.object({ visibility: z.enum(['VISIBLE', 'HIDDEN']), reason: z.string().trim().min(3).max(500) }).strict();
export async function moderationQueue(actorId: string) {
  await assertAdminActor(actorId);
  const [discussions, replies] = await Promise.all([
    db.discussion.findMany({ where: { visibility: { not: 'DELETED' } }, orderBy: { createdAt: 'desc' }, take: 50, select: { id: true, title: true, visibility: true, isLocked: true, author: { select: { name: true } } } }),
    db.reply.findMany({ where: { visibility: { not: 'DELETED' } }, orderBy: { createdAt: 'desc' }, take: 50, select: { id: true, body: true, visibility: true, author: { select: { name: true } } } })
  ]);
  return { discussions, replies };
}
export async function moderateDiscussion(actorId: string, id: string, payload: unknown) {
  await assertAdminActor(actorId);
  const input = discussionAction.parse(payload);
  if (!await db.discussion.findUnique({ where: { id } })) throw missing();
  return db.$transaction(async tx => {
    const row = await tx.discussion.update({ where: { id }, data: { visibility: input.visibility, isLocked: input.isLocked }, select: { id: true, visibility: true, isLocked: true } });
    await tx.auditLog.create({ data: { actorId, action: 'MODERATE', entityType: 'Discussion', entityId: id, reason: input.reason } });
    return row;
  });
}
export async function moderateReply(actorId: string, id: string, payload: unknown) {
  await assertAdminActor(actorId);
  const input = replyAction.parse(payload);
  if (!await db.reply.findUnique({ where: { id } })) throw missing();
  return db.$transaction(async tx => {
    const row = await tx.reply.update({ where: { id }, data: { visibility: input.visibility }, select: { id: true, visibility: true } });
    await tx.auditLog.create({ data: { actorId, action: 'MODERATE', entityType: 'Reply', entityId: id, reason: input.reason } });
    return row;
  });
}
