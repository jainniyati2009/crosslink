'use client';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/components/api';
import { classState } from '@/features/timetable/schemas';

type Term = { id: string; name: string; startsOn: string; endsOn: string };
type Cohort = { id: string; termId: string; programme: string; semester: number; section: string };
type Entry = { id: string; weekday: number; startMinute: number; endMinute: number; courseCode: string; courseTitle: string; room: string; instructor: string | null };
type Schedule = { id: string; isDemo: boolean; version: number; cohort: { term: Term }; entries: Entry[] };

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const clock = (n: number) => `${String(Math.floor(n / 60)).padStart(2, '0')}:${String(n % 60).padStart(2, '0')}`;
const branchName = (programme: string) => programme.replace(/^B\.?Tech\s*/i, '').replace(/\s*\(demo\)$/i, '').trim();

export function TimetableView({ terms, cohorts, initialCohortId }: { terms: Term[]; cohorts: Cohort[]; initialCohortId: string | null }) {
  const initialCohort = cohorts.find(c => c.id === initialCohortId);
  const [branch, setBranch] = useState(initialCohort?.programme ?? '');
  const [cohort, setCohort] = useState(initialCohort?.id ?? '');
  const [day, setDay] = useState(Math.min(5, Math.max(1, new Date().getDay())));
  const [view, setView] = useState<'week' | 'day'>('week');
  const branches = [...new Set(cohorts.map(c => c.programme))];
  const sections = cohorts.filter(c => c.programme === branch);

  const q = useQuery({ queryKey: ['timetable', cohort], queryFn: () => api<Schedule | null>(`/timetables?cohortId=${encodeURIComponent(cohort)}`), enabled: !!cohort });
  const schedule = q.data;
  const state = schedule ? classState(schedule.entries, { startsOn: new Date(schedule.cohort.term.startsOn), endsOn: new Date(schedule.cohort.term.endsOn) }, new Date()) : null;
  const agenda = (weekday: number) => schedule?.entries.filter(e => e.weekday === weekday).map(e => <div className="agenda-item" key={e.id}><div className="time">{clock(e.startMinute)}<br />{clock(e.endMinute)}</div><div><strong>{e.courseCode} · {e.courseTitle}</strong><div className="muted">{e.room}{e.instructor ? ` · ${e.instructor}` : ''}</div></div></div>);

  return <>
    <div className="filters timetable-filters">
      <div className="field"><label htmlFor="timetable-branch">Branch</label><select id="timetable-branch" className="search" value={branch} onChange={e => { setBranch(e.target.value); setCohort(''); }}><option value="">Choose branch</option>{branches.map(value => <option key={value} value={value}>{branchName(value)}</option>)}</select></div>
      <div className="field"><label htmlFor="timetable-section">Section</label><select id="timetable-section" className="search" value={cohort} disabled={!branch} onChange={e => setCohort(e.target.value)}><option value="">{branch ? 'Choose section' : 'Choose branch first'}</option>{sections.map(c => { const termName = terms.find(t => t.id === c.termId)?.name; return <option key={c.id} value={c.id}>Semester {c.semester} · Section {c.section}{termName ? ` · ${termName}` : ''}</option>; })}</select></div>
      <div className="row timetable-view-toggle" aria-label="Timetable view"><button type="button" className={`button ${view === 'week' ? '' : 'secondary'}`} onClick={() => setView('week')}>Week</button><button type="button" className={`button ${view === 'day' ? '' : 'secondary'}`} onClick={() => setView('day')}>Day</button></div>
    </div>
    {!cohort ? <div className="empty">Choose a branch and section to see the timetable.</div> : q.isLoading ? <div className="empty">Loading timetable…</div> : q.error ? <div className="empty error">{q.error.message}</div> : !schedule ? <div className="empty">No timetable published for this section.</div> : <>
      <div className="card" style={{ marginBottom: 20 }}><div className="row"><div><span className="eyebrow">At a glance</span><h2 style={{ fontSize: '1.5rem' }}>{state?.kind === 'OUT_OF_TERM' ? 'Selected term is not current' : state?.kind === 'NO_CLASSES' ? 'No classes today' : state?.kind === 'DONE' ? 'You’re done for today' : state?.current ? `Now: ${state.current.courseCode}` : state?.next ? `Next: ${state.next.courseCode}` : 'Your schedule'}</h2></div>{schedule.isDemo && <span className="tag red">Demo schedule</span>}</div>{state?.next && <p className="muted">Next class at {clock(state.next.startMinute)} · {state.next.room}</p>}{state?.freeMinutes !== null && state?.freeMinutes !== undefined && <small>Between classes: {state.freeMinutes} minutes</small>}</div>
      <div className={view === 'week' ? 'week-grid' : 'hidden'}>{days.map((d, i) => <div key={d}><h3>{d}</h3>{agenda(i + 1)?.length ? agenda(i + 1) : <div className="muted">No classes</div>}</div>)}</div>
      <div className={view === 'day' ? '' : 'mobile-agenda'}><div className="filters" style={{ gap: 5 }}>{days.map((d, i) => <button type="button" key={d} className={`button ${day === i + 1 ? '' : 'secondary'}`} onClick={() => setDay(i + 1)}>{d.slice(0, 3)}</button>)}</div><div className="agenda">{agenda(day)?.length ? agenda(day) : <div className="empty">No classes on {days[day - 1]}.</div>}</div></div>
    </>}
  </>;
}
