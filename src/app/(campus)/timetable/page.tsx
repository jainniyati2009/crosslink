import { requireUser } from '@/lib/auth/guards.server';
import { listTerms, listCohorts, getTimetableByCohort } from '@/features/timetable/service.server';
import { TimetableView } from '@/components/timetable/timetable-view';
import { suppliedTimetableTerms, suppliedTimetableCohorts, suppliedTimetableSchedules } from '@/features/timetable/supplied-schedules';

export default async function Timetable() {
  const user = await requireUser();
  const [terms, databaseCohorts, schedule] = await Promise.all([listTerms(), listCohorts(), user.selectedCohortId ? getTimetableByCohort(user.selectedCohortId) : null]);
  const initialSchedule = schedule ? { ...schedule, cohort: { ...schedule.cohort, term: { ...schedule.cohort.term, startsOn: schedule.cohort.term.startsOn.toISOString(), endsOn: schedule.cohort.term.endsOn.toISOString() } } } : null;
  const cohorts = [...databaseCohorts.filter(c => !c.programme.toLowerCase().includes('(demo)')), ...suppliedTimetableCohorts];
  const allTerms = [...terms.filter(t => !t.name.toLowerCase().includes('demo')).map(t => ({ ...t, startsOn: t.startsOn.toISOString(), endsOn: t.endsOn.toISOString() })), ...suppliedTimetableTerms];

  return <>
    <div className="page-head">
      <div>
        <div className="eyebrow">Timetable</div>
        <h1>Your timetable</h1>
        <p>Your classes, rooms, and faculty.</p>
      </div>
    </div>
    <TimetableView terms={allTerms} cohorts={cohorts} initialCohortId={user.selectedCohortId} initialSchedule={initialSchedule} suppliedSchedules={suppliedTimetableSchedules} />
  </>;
}
