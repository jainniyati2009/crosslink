import 'next-auth';
declare module 'next-auth' {
  interface User { bio?: string; role?: 'STUDENT' | 'ADMIN'; status?: 'ACTIVE' | 'SUSPENDED'; selectedCohortId?: string | null; onboardingCompletedAt?: Date | null }
  interface Session { user: { id: string; bio?: string; role?: 'STUDENT' | 'ADMIN'; status?: 'ACTIVE' | 'SUSPENDED'; selectedCohortId?: string | null; onboardingCompletedAt?: Date | string | null } & DefaultSession['user'] }
}
