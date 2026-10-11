import { requireAdmin } from '@/lib/auth/guards.server';
import { ok } from '@/lib/api-errors';
import { route } from '@/lib/route';
import { moderationQueue } from '@/features/moderation/service.server';
export const runtime = 'nodejs';
export const GET = route(async () => { const actor = await requireAdmin(); return ok(await moderationQueue(actor.id)); });
