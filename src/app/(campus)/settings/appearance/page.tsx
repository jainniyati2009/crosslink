import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ThemePicker } from '@/components/theme-picker';
import { requireUser } from '@/lib/auth/guards.server';

export default async function AppearanceSettings() {
  const user = await requireUser();
  if (!user.onboardingCompletedAt) redirect('/onboarding');

  return <>
    <div className="page-head"><div><div className="eyebrow">Make it yours</div><h1>Appearance</h1><p>Choose a color theme for your campus desk.</p></div><Link className="button secondary" href="/settings/profile">Edit profile</Link></div>
    <section className="card appearance-card" aria-labelledby="theme-heading">
      <div className="appearance-heading"><div><h2 id="theme-heading">Color theme</h2><p>Changes apply right away.</p></div></div>
      <ThemePicker />
    </section>
  </>;
}
