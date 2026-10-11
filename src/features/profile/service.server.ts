import 'server-only';
import { db } from '@/lib/db';
import { missing } from '@/lib/api-errors';
import { profileInput } from './schemas';

export async function updateProfile(id: string, payload: unknown) {
  const input = profileInput.parse(payload);
  if (input.selectedCohortId && !await db.cohort.findUnique({ where: { id: input.selectedCohortId }, select: { id: true } })) throw missing();
  return db.user.update({ where: { id }, data: { ...input, onboardingCompletedAt: new Date() }, select: { id: true, name: true, email: true, image: true, bio: true, selectedCohortId: true } });
}
export async function publicProfile(id: string) {
  const user = await db.user.findUnique({ where: { id }, select: { id: true, name: true, image: true, bio: true, selectedCohort: { select: { programme: true, semester: true, section: true } }, discussions: { where: { visibility: 'VISIBLE' }, orderBy: { createdAt: 'desc' }, take: 20, select: { id: true, title: true, category: true, createdAt: true } } } });
  if (!user) throw missing();
  return user;
}
