import { requireUser } from '@/lib/auth/guards.server';
import { ok } from '@/lib/api-errors';
import { route } from '@/lib/route';
import { listCohorts } from '@/features/timetable/service.server';
export const runtime = 'nodejs';
export const GET = route(async request => { await requireUser(); return ok(await listCohorts(new URL(request.url).searchParams.get('termId') ?? undefined)); });
