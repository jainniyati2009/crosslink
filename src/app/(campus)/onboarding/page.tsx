import { requireUser } from '@/lib/auth/guards.server';
import { listCohorts } from '@/features/timetable/service.server';
import { ProfileForm } from '@/components/forms/profile-form';
export default async function Onboarding(){const user=await requireUser();const cohorts=await listCohorts();return <><div className="page-head"><div><div className="eyebrow">Make it yours</div><h1>Welcome to Campus Desk.</h1><p>Confirm your name and choose your section. You can add it later.</p></div></div><div style={{maxWidth:700}}><ProfileForm user={user} cohorts={cohorts} onboarding/></div></>}
