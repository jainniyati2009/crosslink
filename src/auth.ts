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
    async session({ session, user }) {
      if (!user?.id) return session;
      const current = await db.user.findUnique({ where: { id: user.id }, select: { id: true, name: true, email: true, image: true, bio: true, role: true, status: true, selectedCohortId: true, onboardingCompletedAt: true } });
      if (!current || current.status !== 'ACTIVE') return null as never;
      session.user = { ...session.user, ...current };
      return session;
    }
  },
  trustHost: true
});
