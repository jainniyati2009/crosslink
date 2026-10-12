import { requireUser } from '@/lib/auth/guards.server';
import { listCohorts } from '@/features/timetable/service.server';
import { ProfileForm } from '@/components/forms/profile-form';
export default async function Onboarding(){const user=await requireUser();const cohorts=await listCohorts();return <><div className="page-head"><div><div className="eyebrow">Profile</div><h1>Set up your profile</h1><p>Choose your name and section.</p></div></div><div style={{maxWidth:700}}><ProfileForm user={user} cohorts={cohorts} onboarding/></div></>}
