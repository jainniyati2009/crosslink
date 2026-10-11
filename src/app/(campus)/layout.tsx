import { redirect } from 'next/navigation';
import { requireUser } from '@/lib/auth/guards.server';
import { AppShell } from '@/components/layout/app-shell';
export const dynamic = 'force-dynamic';
export default async function CampusLayout({ children }: { children: React.ReactNode }) {
  let user;
  try { user = await requireUser(); } catch { redirect('/login'); }
  return <AppShell user={user}>{children}</AppShell>;
}
