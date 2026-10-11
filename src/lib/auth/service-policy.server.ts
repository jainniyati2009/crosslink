import 'server-only';
import { db } from '@/lib/db';
import { forbidden } from '@/lib/api-errors';
export async function assertAdminActor(actorId: string) {
  const actor = await db.user.findUnique({ where: { id: actorId }, select: { role: true, status: true } });
  if (!actor || actor.status !== 'ACTIVE' || actor.role !== 'ADMIN') throw forbidden();
}
