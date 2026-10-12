import 'server-only';
import { cache } from 'react';
import { db } from '@/lib/db';
import { AppError, missing, invalid } from '@/lib/api-errors';
import { assertDiscussionOpen, assertOwner } from '@/lib/auth/guards.server';
import { discussionInput, discussionEdit, replyInput, listInput } from './schemas';
import { z } from 'zod';

const author = { select: { id: true, name: true, image: true } } as const;
const discussionView = { id: true, title: true, body: true, category: true, isLocked: true, isDemo: true, createdAt: true, updatedAt: true, author, _count: { select: { replies: { where: { visibility: 'VISIBLE' as const } } } } } as const;
const replyView = { id: true, body: true, createdAt: true, updatedAt: true, author } as const;
export function parseList(url: string) { const p = new URL(url).searchParams; return listInput.parse(Object.fromEntries(p.entries())); }
export async function listDiscussions(input: z.infer<typeof listInput>) {
  if (input.cursor && !await db.discussion.findUnique({ where: { id: input.cursor }, select: { id: true } })) throw invalid('Invalid pagination cursor.');
  const rows = await db.discussion.findMany({
    where: { visibility: 'VISIBLE', ...(input.category ? { category: input.category } : {}), ...(input.q ? { OR: [{ title: { contains: input.q, mode: 'insensitive' } }, { body: { contains: input.q, mode: 'insensitive' } }] } : {}) },
    orderBy: [{ createdAt: 'desc' }, { id: 'desc' }], take: input.limit + 1,
    ...(input.cursor ? { cursor: { id: input.cursor }, skip: 1 } : {}), select: discussionView
  });
  const nextCursor = rows.length > input.limit ? rows[input.limit - 1].id : null;
  return { data: rows.slice(0, input.limit), nextCursor };
}
export const getDiscussion = cache(async (id: string) => {
  const row = await db.discussion.findFirst({ where: { id, visibility: 'VISIBLE' }, select: discussionView });
  if (!row) throw missing();
  return row;
});
export async function createDiscussion(actorId: string, payload: unknown) {
  const input = discussionInput.parse(payload);
  return db.discussion.create({ data: { ...input, authorId: actorId }, select: discussionView });
}
export async function editDiscussion(actorId: string, id: string, payload: unknown) {
  const input = discussionEdit.parse(payload);
  const row = await db.discussion.findUnique({ where: { id }, select: { authorId: true, visibility: true } });
  if (!row || row.visibility !== 'VISIBLE') throw missing();
  assertOwner(actorId, row.authorId);
  return db.discussion.update({ where: { id }, data: input, select: discussionView });
}
export async function deleteDiscussion(actorId: string, id: string) {
  const row = await db.discussion.findUnique({ where: { id }, select: { authorId: true, visibility: true } });
  if (!row || row.visibility !== 'VISIBLE') throw missing();
  assertOwner(actorId, row.authorId);
  await db.discussion.update({ where: { id }, data: { visibility: 'DELETED' } });
}
export async function listReplies(discussionId: string, url: string) {
  await getDiscussion(discussionId);
  const p = new URL(url).searchParams;
  const limit = p.has('limit') ? z.coerce.number().int().min(1).max(50).parse(p.get('limit')) : 20;
  const cursor = p.has('cursor') ? z.string().min(1).max(100).regex(/^[A-Za-z0-9_-]+$/).parse(p.get('cursor')) : null;
  if (cursor && !await db.reply.findUnique({ where: { id: cursor }, select: { id: true } })) throw invalid('Invalid pagination cursor.');
  const rows = await db.reply.findMany({ where: { discussionId, visibility: 'VISIBLE' }, orderBy: [{ createdAt: 'asc' }, { id: 'asc' }], take: limit + 1, ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}), select: replyView });
  return { data: rows.slice(0, limit), nextCursor: rows.length > limit ? rows[limit - 1].id : null };
}
export async function createReply(actorId: string, discussionId: string, payload: unknown) {
  const input = replyInput.parse(payload);
  const discussion = await db.discussion.findUnique({ where: { id: discussionId }, select: { id: true, visibility: true, isLocked: true } });
  if (!discussion) throw missing();
  assertDiscussionOpen(discussion);
  return db.reply.create({ data: { ...input, discussionId, authorId: actorId }, select: replyView });
}
export async function editReply(actorId: string, id: string, payload: unknown) {
  const input = replyInput.parse(payload);
  const row = await db.reply.findUnique({ where: { id }, include: { discussion: { select: { visibility: true, isLocked: true } } } });
  if (!row || row.visibility !== 'VISIBLE' || row.discussion.visibility !== 'VISIBLE') throw missing();
  assertOwner(actorId, row.authorId);
  if (row.discussion.isLocked) throw new AppError(409, 'LOCKED', 'This discussion is locked.');
  return db.reply.update({ where: { id }, data: input, select: replyView });
}
export async function deleteReply(actorId: string, id: string) {
  const row = await db.reply.findUnique({ where: { id }, select: { authorId: true, visibility: true } });
  if (!row || row.visibility !== 'VISIBLE') throw missing();
  assertOwner(actorId, row.authorId);
  await db.reply.update({ where: { id }, data: { visibility: 'DELETED' } });
}
