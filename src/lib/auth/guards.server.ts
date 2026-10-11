import 'server-only';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { AppError, forbidden } from '@/lib/api-errors';
export { assertOwner, assertDiscussionOpen } from './access-policy';

export async function requireUser() {
  const session = await auth();
  const id = session?.user?.id;
  if (!id) throw new AppError(401, 'UNAUTHORIZED', 'Please sign in with your university account.');
  const user = await db.user.findUnique({ where: { id }, select: { id: true, name: true, email: true, image: true, bio: true, role: true, status: true, selectedCohortId: true, onboardingCompletedAt: true } });
  if (!user || user.status !== 'ACTIVE') throw new AppError(401, 'UNAUTHORIZED', 'Your session is no longer active.');
  return user;
}
export async function requireAdmin() {
  const user = await requireUser();
  if (user.role !== 'ADMIN') throw forbidden();
  return user;
}
