import { requireUser, requireAdmin } from '@/lib/auth/guards.server';
import { mutationBody } from '@/lib/mutation-guard.server';
import { ok } from '@/lib/api-errors';
import { route } from '@/lib/route';
import { getAnnouncement, updateAnnouncement } from '@/features/announcements/service.server';
export const runtime = 'nodejs';
type Context = { params: Promise<{ id: string }> };
export const GET = route(async (_request, { params }: Context) => { await requireUser(); return ok(await getAnnouncement((await params).id)); });
export const PATCH = route(async (request, { params }: Context) => { const actor = await requireAdmin(); return ok(await updateAnnouncement(actor.id, (await params).id, await mutationBody(request))); });
