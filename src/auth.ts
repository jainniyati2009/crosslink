import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { db } from '@/lib/db';
import { isEligibleGoogleProfile, normalizeEmail } from '@/lib/auth/university-policy';

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  session: { strategy: 'database' },
  pages: { signIn: '/login', error: '/login' },
  providers: [Google({ authorization: { params: { scope: 'openid email profile', hd: process.env.GOOGLE_WORKSPACE_DOMAIN ?? 'nsut.ac.in' } }, profile(profile) { return { id: profile.sub, name: profile.name, email: normalizeEmail(profile.email), image: profile.picture, emailVerified: profile.email_verified ? new Date() : null }; } })],
  callbacks: {
    signIn({ account, profile }) {
      return account?.provider === 'google' && isEligibleGoogleProfile(profile ?? {}, process.env.GOOGLE_WORKSPACE_DOMAIN ?? 'nsut.ac.in');
    },
    session({ session, user }) {
      // The database-session adapter has just loaded this user with the session.
      if (!user?.id || user.status !== 'ACTIVE') return null as never;
      session.user = {
        id: user.id, name: user.name, email: user.email, image: user.image,
        bio: user.bio ?? '', role: user.role, status: user.status,
        selectedCohortId: user.selectedCohortId ?? null,
        onboardingCompletedAt: user.onboardingCompletedAt ?? null,
      };
      return session;
    }
  },
  trustHost: true
});
