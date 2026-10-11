import { requireUser } from '@/lib/auth/guards.server';
import { mutationBody } from '@/lib/mutation-guard.server';
import { ok } from '@/lib/api-errors';
import { route } from '@/lib/route';
import { rateLimit } from '@/lib/rate-limit.server';
import { listDiscussions, parseList, createDiscussion } from '@/features/discussions/service.server';
export const runtime = 'nodejs';
export const GET = route(async request => { await requireUser(); const result = await listDiscussions(parseList(request.url)); return ok(result.data, 200, { nextCursor: result.nextCursor }); });
export const POST = route(async request => { const actor = await requireUser(); const body = await mutationBody(request); await rateLimit(`discussion:${actor.id}`); return ok(await createDiscussion(actor.id, body), 201); });
