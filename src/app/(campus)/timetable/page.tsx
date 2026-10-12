import { requireUser } from '@/lib/auth/guards.server';
import { listTerms, listCohorts } from '@/features/timetable/service.server';
import { TimetableView } from '@/components/timetable/timetable-view';
const timetablePdf = '/documents/nsut-btech-timetable-jul-dec-2026.pdf';

export default async function Timetable() {
  const user = await requireUser();
  const [terms, cohorts] = await Promise.all([listTerms(), listCohorts()]);

  return <>
    <div className="page-head">
      <div>
        <div className="eyebrow">Your week, mapped</div>
        <h1>Timetable</h1>
        <p>Classes, rooms, and the next break in your day.</p>
      </div>
    </div>
    <section className="card timetable-resource" aria-labelledby="official-timetable-title">
      <div className="timetable-resource-head">
        <div>
          <div className="eyebrow">Official timetable · July–December 2026</div>
          <h2 id="official-timetable-title">B.Tech class schedules</h2>
          <p className="muted">CSE, CSAI, CSDS, and MAC schedules.</p>
        </div>
        <div className="timetable-resource-actions">
          <a className="button secondary" href={timetablePdf} target="_blank" rel="noreferrer">Open PDF ↗</a>
          <a className="button" href={timetablePdf} download>Download</a>
        </div>
      </div>
      <iframe className="timetable-pdf" src={`${timetablePdf}#view=FitH`} title="B.Tech timetable for July to December 2026" />
    </section>
    <section className="timetable-personal" aria-labelledby="personal-timetable-title">
      <div className="timetable-section-heading">
        <div className="eyebrow">Personal timetable</div>
        <h2 id="personal-timetable-title">Your weekly view</h2>
        <p className="muted">Choose your cohort to view its schedule.</p>
      </div>
      <TimetableView terms={terms.map(t => ({ ...t, startsOn: t.startsOn.toISOString(), endsOn: t.endsOn.toISOString() }))} cohorts={cohorts} initialCohortId={user.selectedCohortId} />
    </section>
  </>;
}
