import { redirect } from 'next/navigation';
import { requireAdmin } from '@/lib/auth/guards.server';
import { AppShell } from '@/components/layout/app-shell';
export const dynamic='force-dynamic';
export default async function AdminLayout({children}:{children:React.ReactNode}){let user;try{user=await requireAdmin();}catch{redirect('/feed');}return <AppShell user={user}>{children}</AppShell>}
