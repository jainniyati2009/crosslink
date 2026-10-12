import { requireUser } from '@/lib/auth/guards.server';
import { listTerms, listCohorts } from '@/features/timetable/service.server';
import { TimetableView } from '@/components/timetable/timetable-view';

export default async function Timetable() {
  const user = await requireUser();
  const [terms, cohorts] = await Promise.all([listTerms(), listCohorts()]);

  return <>
    <div className="page-head">
      <div>
        <div className="eyebrow">Timetable</div>
        <h1>Your classes</h1>
        <p>Choose your branch, then your section.</p>
      </div>
    </div>
    <TimetableView terms={terms.map(t => ({ ...t, startsOn: t.startsOn.toISOString(), endsOn: t.endsOn.toISOString() }))} cohorts={cohorts} initialCohortId={user.selectedCohortId} />
  </>;
}
