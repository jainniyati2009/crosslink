import { auth, signIn } from '@/auth';
import { redirect } from 'next/navigation';
export const dynamic = 'force-dynamic';
export default async function Login({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  if (await auth()) redirect('/feed');
  const { error } = await searchParams;
  const clientId = process.env.AUTH_GOOGLE_ID;
  const clientSecret = process.env.AUTH_GOOGLE_SECRET;
  const oauthConfigured = Boolean(
    clientId && clientSecret &&
    !['your-google-client-id', 'unconfigured-local-preview'].includes(clientId) &&
    !['your-google-client-secret', 'unconfigured-local-preview'].includes(clientSecret)
  );
  return <main className="login">
    <section className="login-art">
      <div className="brand"><span className="brand-mark" style={{ borderColor: '#fff', color: '#fff' }}>O</span><span>ONE PLACE<small>Campus Desk</small></span></div>
      <div><div className="eyebrow">NSUT STUDENTS</div><h1>Campus<br/><em>updates.</em></h1><p>Notices, timetables, and student discussions.</p></div>
      <div className="login-ornament">Discussions · Notices · Timetable</div>
    </section>
    <section className="login-panel"><div className="login-box">
      <div className="eyebrow">NSUT ACCOUNT</div>
      <h2>Sign in</h2>
      <p className="muted">Use your @nsut.ac.in Google account.</p>
      {!oauthConfigured ? <p className="error" role="status">Google sign-in is unavailable.</p> : <>
        {error === 'AccessDenied' && <p className="error" role="alert">Use your @nsut.ac.in Google account.</p>}
        <form action={async () => { 'use server'; await signIn('google', { redirectTo: '/feed' }); }}><button className="button" type="submit"><span aria-hidden>G</span> Continue with Google</button></form>
      </>}
    </div></section>
  </main>;
}
