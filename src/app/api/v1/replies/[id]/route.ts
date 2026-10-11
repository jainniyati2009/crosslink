import { requireUser } from '@/lib/auth/guards.server';
import { mutationBody } from '@/lib/mutation-guard.server';
import { ok } from '@/lib/api-errors';
import { route } from '@/lib/route';
import { editReply, deleteReply } from '@/features/discussions/service.server';
export const runtime = 'nodejs';
type Context = { params: Promise<{ id: string }> };
export const PATCH = route(async (request, { params }: Context) => { const actor = await requireUser(); return ok(await editReply(actor.id, (await params).id, await mutationBody(request))); });
export const DELETE = route(async (request, { params }: Context) => { const actor = await requireUser(); await mutationBody(request); await deleteReply(actor.id, (await params).id); return new Response(null, { status: 204 }); });
