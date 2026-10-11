import 'server-only';
import { db } from '@/lib/db';
import { AppError, missing } from '@/lib/api-errors';
import { scheduleInput, replaceInput, validateEntries } from './schemas';
import type { Prisma } from '@prisma/client';
import { assertAdminActor } from '@/lib/auth/service-policy.server';

const view = { id: true, cohortId: true, timezone: true, version: true, isDemo: true, updatedAt: true, cohort: { select: { programme: true, semester: true, section: true, term: { select: { id: true, name: true, startsOn: true, endsOn: true } } } }, entries: { orderBy: [{ weekday: 'asc' as const }, { startMinute: 'asc' as const }], select: { id: true, weekday: true, startMinute: true, endMinute: true, courseCode: true, courseTitle: true, room: true, instructor: true } } } satisfies Prisma.TimetableSelect;
export async function listTerms() { return db.academicTerm.findMany({ orderBy: { startsOn: 'desc' }, select: { id: true, name: true, startsOn: true, endsOn: true } }); }
export async function listCohorts(termId?: string) { return db.cohort.findMany({ where: termId ? { termId } : {}, orderBy: [{ programme: 'asc' }, { semester: 'asc' }, { section: 'asc' }], select: { id: true, termId: true, programme: true, semester: true, section: true } }); }
export async function getTimetable(id: string) { const row = await db.timetable.findUnique({ where: { id }, select: view }); if (!row) throw missing(); return row; }
export async function getTimetableByCohort(cohortId: string) { return db.timetable.findUnique({ where: { cohortId }, select: view }); }
export async function createTimetable(actorId: string, payload: unknown) {
  await assertAdminActor(actorId);
  const input = scheduleInput.parse(payload);
  if (!validateEntries(input.entries)) throw new AppError(422, 'OVERLAP', 'Class entries overlap.');
  if (!await db.cohort.findUnique({ where: { id: input.cohortId } })) throw missing();
  return db.$transaction(async tx => {
    const row = await tx.timetable.create({ data: { cohortId: input.cohortId, updatedById: actorId, entries: { create: input.entries } }, select: view });
    await tx.auditLog.create({ data: { actorId, action: 'CREATE', entityType: 'Timetable', entityId: row.id } });
    return row;
  });
}
export async function replaceTimetable(actorId: string, id: string, payload: unknown) {
  await assertAdminActor(actorId);
  const input = replaceInput.parse(payload);
  if (!validateEntries(input.entries)) throw new AppError(422, 'OVERLAP', 'Class entries overlap.');
  return db.$transaction(async tx => {
    const changed = await tx.timetable.updateMany({ where: { id, version: input.expectedVersion }, data: { version: { increment: 1 }, updatedById: actorId, isDemo: false } });
    if (!changed.count) throw new AppError(409, 'STALE_VERSION', 'This timetable changed while you were editing. Reload it and try again.');
    await tx.timetableEntry.deleteMany({ where: { timetableId: id } });
    await tx.timetableEntry.createMany({ data: input.entries.map(e => ({ ...e, timetableId: id })) });
    await tx.auditLog.create({ data: { actorId, action: 'UPDATE', entityType: 'Timetable', entityId: id } });
    const row = await tx.timetable.findUnique({ where: { id }, select: view });
    return row!;
  });
}
