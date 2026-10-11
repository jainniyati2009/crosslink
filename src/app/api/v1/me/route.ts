import { requireUser } from '@/lib/auth/guards.server';
import { mutationBody } from '@/lib/mutation-guard.server';
import { ok } from '@/lib/api-errors';
import { route } from '@/lib/route';
import { updateProfile } from '@/features/profile/service.server';
export const runtime = 'nodejs';
export const GET = route(async () => { const user = await requireUser(); return ok({ id: user.id, name: user.name, email: user.email, image: user.image, bio: user.bio, role: user.role, selectedCohortId: user.selectedCohortId }); });
export const PATCH = route(async request => { const actor = await requireUser(); return ok(await updateProfile(actor.id, await mutationBody(request))); });
