import { requireUser, requireAdmin } from '@/lib/auth/guards.server';
import { mutationBody } from '@/lib/mutation-guard.server';
import { ok } from '@/lib/api-errors';
import { route } from '@/lib/route';
import { listAnnouncements, createAnnouncement } from '@/features/announcements/service.server';
export const runtime = 'nodejs';
export const GET = route(async request => { await requireUser(); return ok(await listAnnouncements(new URL(request.url).searchParams.get('category') ?? undefined)); });
export const POST = route(async request => { const actor = await requireAdmin(); return ok(await createAnnouncement(actor.id, await mutationBody(request)), 201); });
