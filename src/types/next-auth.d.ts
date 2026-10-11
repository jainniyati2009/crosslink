import 'next-auth';
declare module 'next-auth' {
  interface Session { user: { id: string; role?: 'STUDENT' | 'ADMIN'; status?: 'ACTIVE' | 'SUSPENDED'; selectedCohortId?: string | null } & DefaultSession['user'] }
}
