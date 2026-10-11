import { requireUser } from '@/lib/auth/guards.server';
import { ok } from '@/lib/api-errors';
import { route } from '@/lib/route';
import { listTerms } from '@/features/timetable/service.server';
export const runtime = 'nodejs';
export const GET = route(async () => { await requireUser(); return ok(await listTerms()); });
