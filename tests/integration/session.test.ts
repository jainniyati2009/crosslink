import { describe, expect, it, vi } from 'vitest';

type SessionInput = { session: { user: Record<string, unknown> }; user: Record<string, unknown> };
const mocks = vi.hoisted(() => ({
  session: undefined as undefined | ((input: SessionInput) => unknown),
  findUnique: vi.fn(),
}));

vi.mock('next-auth', () => ({ default: (config: { callbacks: { session: (input: SessionInput) => unknown } }) => {
  mocks.session = config.callbacks.session;
  return { handlers: {}, auth: vi.fn(), signIn: vi.fn(), signOut: vi.fn() };
} }));
vi.mock('next-auth/providers/google', () => ({ default: (options: unknown) => options }));
vi.mock('@auth/prisma-adapter', () => ({ PrismaAdapter: vi.fn(() => ({})) }));
vi.mock('@/lib/db', () => ({ db: { user: { findUnique: mocks.findUnique } } }));

import '@/auth';

describe('database session callback', () => {
  it('uses the freshly loaded adapter user without another lookup', () => {
    const result = mocks.session!({ session: { user: { access_token: 'private-token' } }, user: {
      id: 'admin-1', email: 'admin@nsut.ac.in', name: 'Admin', role: 'ADMIN',
      status: 'ACTIVE', bio: 'Campus admin', selectedCohortId: 'cohort-1',
      onboardingCompletedAt: new Date('2026-10-01'), access_token: 'private-token',
    } });
    expect(result).toMatchObject({ user: { id: 'admin-1', role: 'ADMIN', status: 'ACTIVE', selectedCohortId: 'cohort-1' } });
    expect(result).not.toHaveProperty('user.access_token');
    expect(mocks.findUnique).not.toHaveBeenCalled();
  });

  it('denies suspended and missing adapter users', () => {
    expect(mocks.session!({ session: { user: {} }, user: { id: 'student-1', status: 'SUSPENDED' } })).toBeNull();
    expect(mocks.session!({ session: { user: {} }, user: {} })).toBeNull();
  });
});
