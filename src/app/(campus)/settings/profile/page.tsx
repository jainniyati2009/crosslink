import Link from 'next/link';
import { requireUser } from '@/lib/auth/guards.server';
import { listCohorts } from '@/features/timetable/service.server';
import { ProfileForm } from '@/components/forms/profile-form';
export default async function SettingsProfile(){const user=await requireUser();const cohorts=await listCohorts();return <><div className="page-head"><div><div className="eyebrow">Your account</div><h1>Profile settings</h1><p>Update how you appear to the campus community.</p></div><Link className="button secondary" href={`/profile/${user.id}`}>View public profile</Link></div><div style={{maxWidth:700}}><ProfileForm user={user} cohorts={cohorts}/></div></>}
