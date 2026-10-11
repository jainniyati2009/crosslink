import { listCohorts } from '@/features/timetable/service.server';
import { TimetableManager } from '@/components/admin/timetable-manager';
export default async function AdminTimetables(){const cohorts=await listCohorts();return <><div className="page-head"><div><div className="eyebrow">Admin desk</div><h1>Timetables</h1><p>Update each cohort’s weekly class schedule.</p></div></div>{cohorts.length?<TimetableManager cohorts={cohorts}/>:<div className="empty">No cohorts exist yet. Run the seed or create academic terms first.</div>}</>}
