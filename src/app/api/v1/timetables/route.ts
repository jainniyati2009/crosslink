import { requireUser, requireAdmin } from '@/lib/auth/guards.server';
import { mutationBody } from '@/lib/mutation-guard.server';
import { ok } from '@/lib/api-errors';
import { route } from '@/lib/route';
import { getTimetableByCohort, createTimetable } from '@/features/timetable/service.server';
export const runtime = 'nodejs';
export const GET = route(async request => { await requireUser(); const cohortId = new URL(request.url).searchParams.get('cohortId'); return ok(cohortId ? await getTimetableByCohort(cohortId) : null); });
export const POST = route(async request => { const actor = await requireAdmin(); return ok(await createTimetable(actor.id, await mutationBody(request)), 201); });
