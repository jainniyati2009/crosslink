import 'server-only';
import { auth } from '@/auth';
import { AppError, forbidden } from '@/lib/api-errors';
export { assertOwner, assertDiscussionOpen } from './access-policy';

export async function requireUser() {
  const session = await auth();
  const user = session?.user;
  if (!user?.id) throw new AppError(401, 'UNAUTHORIZED', 'Please sign in with your university account.');
  if (user.status !== 'ACTIVE') throw new AppError(401, 'UNAUTHORIZED', 'Your session is no longer active.');
  return { ...user, bio: user.bio ?? '', onboardingCompletedAt: user.onboardingCompletedAt ?? null };
}
export async function requireAdmin() {
  const user = await requireUser();
  if (user.role !== 'ADMIN') throw forbidden();
  return user;
}
