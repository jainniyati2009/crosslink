import 'server-only';
import { db } from '@/lib/db';
import { missing, invalid } from '@/lib/api-errors';
import { z } from 'zod';
import { publishedWhere } from './policy';
import { assertAdminActor } from '@/lib/auth/service-policy.server';

const category = z.enum(['GENERAL', 'ACADEMIC', 'EVENT', 'DEADLINE']);
export const noticeInput = z.object({ title: z.string().trim().min(3).max(140), body: z.string().trim().min(1).max(20000), category, expiresAt: z.iso.datetime().nullable().optional() }).strict();
export const noticeCreate = noticeInput.extend({ status: z.enum(['DRAFT', 'PUBLISHED']).optional(), isPinned: z.boolean().optional() }).strict();
export const noticeEdit = noticeInput.partial().extend({ status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(), isPinned: z.boolean().optional() }).strict();
const view = { id: true, title: true, body: true, category: true, status: true, isPinned: true, isDemo: true, publishedAt: true, expiresAt: true, createdAt: true, author: { select: { id: true, name: true, image: true } } } as const;
export async function listAnnouncements(categoryFilter?: string, query?: string) {
  const selected = category.safeParse(categoryFilter);
  if (categoryFilter && !selected.success) throw invalid('Invalid announcement category.');
  const q = query?.trim().slice(0, 100);
  return db.announcement.findMany({ where: { ...publishedWhere(), ...(selected.success ? { category: selected.data } : {}), ...(q ? { OR: [{ title: { contains: q, mode: 'insensitive' as const } }, { body: { contains: q, mode: 'insensitive' as const } }] } : {}) }, orderBy: [{ isPinned: 'desc' }, { publishedAt: 'desc' }], select: view });
}
export async function listPinnedAnnouncements() {
  return db.announcement.findMany({ where: { ...publishedWhere(), isPinned: true }, orderBy: { publishedAt: 'desc' }, take: 4, select: { id: true, title: true, category: true, isDemo: true } });
}
export async function getAnnouncement(id: string) {
  const row = await db.announcement.findFirst({ where: { id, ...publishedWhere() }, select: view });
  if (!row) throw missing();
  return row;
}
export async function listAdminAnnouncements(actorId: string) { await assertAdminActor(actorId); return db.announcement.findMany({ orderBy: { updatedAt: 'desc' }, select: view }); }
export async function createAnnouncement(actorId: string, payload: unknown) {
  await assertAdminActor(actorId);
  const input = noticeCreate.parse(payload);
  const status = input.status ?? 'DRAFT';
  return db.announcement.create({ data: { ...input, status, isPinned: input.isPinned ?? false, publishedAt: status === 'PUBLISHED' ? new Date() : null, expiresAt: input.expiresAt ? new Date(input.expiresAt) : null, authorId: actorId }, select: view });
}
export async function updateAnnouncement(actorId: string, id: string, payload: unknown) {
  await assertAdminActor(actorId);
  const input = noticeEdit.parse(payload);
  const old = await db.announcement.findUnique({ where: { id }, select: { id: true, status: true } });
  if (!old) throw missing();
  return db.$transaction(async tx => {
    const row = await tx.announcement.update({ where: { id }, data: { ...input, expiresAt: input.expiresAt === undefined ? undefined : input.expiresAt ? new Date(input.expiresAt) : null, publishedAt: input.status === 'PUBLISHED' && old.status !== 'PUBLISHED' ? new Date() : undefined, isPinned: input.status === 'ARCHIVED' ? false : input.isPinned }, select: view });
    await tx.auditLog.create({ data: { actorId, action: input.status === 'PUBLISHED' ? 'PUBLISH' : input.status === 'ARCHIVED' ? 'ARCHIVE' : 'EDIT', entityType: 'Announcement', entityId: id } });
    return row;
  });
}
export async function deleteAnnouncement(actorId: string, id: string) {
  await assertAdminActor(actorId);
  const exists = await db.announcement.findUnique({ where: { id }, select: { id: true } });
  if (!exists) throw missing();
  await db.$transaction(async tx => {
    await tx.auditLog.create({ data: { actorId, action: 'DELETE', entityType: 'Announcement', entityId: id } });
    await tx.announcement.delete({ where: { id } });
  });
}
