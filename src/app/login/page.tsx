import { auth, signIn } from '@/auth';
import { redirect } from 'next/navigation';
export const dynamic = 'force-dynamic';
export default async function Login({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  if (await auth()) redirect('/feed');
  const { error } = await searchParams;
  return <main className="login"><section className="login-art"><div className="brand"><span className="brand-mark" style={{borderColor:'#fff',color:'#fff'}}>N</span><span>NSUT CONNECT<small>Campus Desk</small></span></div><div><div className="eyebrow">Your student community</div><h1>Your campus,<br/><em>in the loop.</em></h1><p>Discussions, official notices, and your timetable — together.</p></div><div className="login-ornament">A home for campus conversations, the notices that matter, and your week at a glance.</div></section><section className="login-panel"><div className="login-box"><div className="eyebrow">Welcome to Campus Desk</div><h2>Sign in to continue.</h2><p className="muted">Use your eligible NSUT Google account to access your campus desk.</p>{error && <p className="error" role="alert">Sign-in was unsuccessful. Please use a verified @nsut.ac.in Google Workspace account and try again.</p>}<form action={async () => { 'use server'; await signIn('google', { redirectTo: '/feed' }); }}><button className="button" type="submit"><span aria-hidden>G</span> Continue with Google</button></form><small>University account required. New members set up their profile after signing in.</small></div></section></main>;
}
