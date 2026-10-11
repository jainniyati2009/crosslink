import { requireAdmin } from '@/lib/auth/guards.server';
import { mutationBody } from '@/lib/mutation-guard.server';
import { ok } from '@/lib/api-errors';
import { route } from '@/lib/route';
import { replaceTimetable } from '@/features/timetable/service.server';
export const runtime = 'nodejs';
export const PUT = route(async (request, { params }: { params: Promise<{ id: string }> }) => { const actor = await requireAdmin(); return ok(await replaceTimetable(actor.id, (await params).id, await mutationBody(request))); });
