import Link from 'next/link';
import Image from 'next/image';
import { signOut } from '@/auth';
import { Navigation } from './navigation';
export function AppShell({ user, children }: { user: { id: string; name: string | null; image: string | null; role: string }; children: React.ReactNode }) {
  const date = new Intl.DateTimeFormat('en-IN', { timeZone: 'Asia/Kolkata', day: 'numeric', month: 'long', year: 'numeric' }).format(new Date());
  return <><header className="topbar"><div className="topbar-inner wrap"><Link href="/feed" className="brand"><span className="brand-mark">N</span><span>NSUT CONNECT<small>Campus Desk</small></span></Link><div className="top-actions"><span className="date muted">{date}</span><details className="account"><summary aria-label="Account menu"><span className="avatar">{user.image ? <Image src={user.image} alt="" width={35} height={35} unoptimized/> : (user.name?.[0] ?? 'S')}</span><span>{user.name?.split(' ')[0] ?? 'Student'} ▾</span></summary><div className="account-menu"><Link href={`/profile/${user.id}`}>My profile</Link><Link href="/settings/profile">Settings</Link>{user.role === 'ADMIN' && <Link href="/admin">Admin desk</Link>}<form action={async () => { 'use server'; await signOut({ redirectTo: '/login' }); }}><button type="submit">Sign out</button></form></div></details></div></div></header><div className="wrap shell"><Navigation admin={user.role === 'ADMIN'}/><main id="main" className="page">{children}</main></div></>;
}
