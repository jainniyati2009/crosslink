import { requireAdmin } from '@/lib/auth/guards.server';
import { mutationBody } from '@/lib/mutation-guard.server';
import { ok } from '@/lib/api-errors';
import { route } from '@/lib/route';
import { moderateReply } from '@/features/moderation/service.server';
export const runtime = 'nodejs';
export const PATCH = route(async (request, { params }: { params: Promise<{ id: string }> }) => { const actor = await requireAdmin(); return ok(await moderateReply(actor.id, (await params).id, await mutationBody(request))); });
