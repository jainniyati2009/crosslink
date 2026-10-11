import { requireUser } from '@/lib/auth/guards.server';
import { ok } from '@/lib/api-errors';
import { route } from '@/lib/route';
import { publicProfile } from '@/features/profile/service.server';
export const runtime = 'nodejs';
export const GET = route(async (_request, { params }: { params: Promise<{ id: string }> }) => { await requireUser(); return ok(await publicProfile((await params).id)); });
