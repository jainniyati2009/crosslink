'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
const items = [{ href: '/feed', label: 'Feed', short: 'Feed', icon: '▦' }, { href: '/discussions', label: 'Discussions', short: 'Discuss', icon: '◈' }, { href: '/announcements', label: 'Announcements', short: 'Notices', icon: '▤' }, { href: '/timetable', label: 'Timetable', short: 'Timetable', icon: '▣' }, { href: '/settings/profile', label: 'Profile', short: 'Profile', icon: '◯' }];
export function Navigation({ admin }: { admin: boolean }) {
  const pathname = usePathname();
  return <><nav className="side-nav" aria-label="Main navigation">{items.map(item => <Link key={item.href} href={item.href} className={pathname.startsWith(item.href) ? 'active' : ''}><span className="nav-icon" aria-hidden>{item.icon}</span><span className="nav-label">{item.label}</span></Link>)}{admin && <Link href="/admin" className={pathname.startsWith('/admin') ? 'active' : ''}><span className="nav-icon" aria-hidden>✦</span><span className="nav-label">Admin</span></Link>}<div className="side-note">A better way to stay<br/>in the campus loop.</div></nav><nav className="mobile-nav" aria-label="Mobile navigation">{items.slice(0,4).map(item => <Link key={item.href} href={item.href} className={pathname.startsWith(item.href) ? 'active' : ''}><span className="nav-icon" aria-hidden>{item.icon}</span>{item.short}</Link>)}</nav></>;
}
