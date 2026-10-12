'use client';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/components/api';
import { classState } from '@/features/timetable/schemas';

type Term = { id: string; name: string; startsOn: string; endsOn: string };
type Cohort = { id: string; termId: string; programme: string; semester: number; section: string };
type Entry = { id: string; weekday: number; startMinute: number; endMinute: number; courseCode: string; courseTitle: string; room: string; instructor: string | null };
export type Schedule = { id: string; isDemo: boolean; version: number; cohort: { term: Term }; entries: Entry[] };
const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const clock = (n: number) => `${String(Math.floor(n / 60)).padStart(2, '0')}:${String(n % 60).padStart(2, '0')}`;
const branchName = (programme: string) => programme.replace(/^B\.?Tech\s*/i, '').replace(/\s*\(demo\)$/i, '').trim();
const today = () => days.indexOf(new Intl.DateTimeFormat('en', { timeZone: 'Asia/Kolkata', weekday: 'long' }).format(new Date())) + 1;

export function TimetableView({ terms, cohorts, initialCohortId, initialSchedule }: { terms: Term[]; cohorts: Cohort[]; initialCohortId: string | null; initialSchedule: Schedule | null }) {
  const initial = cohorts.find(c => c.id === initialCohortId);
  const [branch, setBranch] = useState(initial?.programme ?? '');
  const [termId, setTermId] = useState(initial?.termId ?? terms[0]?.id ?? '');
  const [semester, setSemester] = useState(initial?.semester.toString() ?? '');
  const [cohort, setCohort] = useState(initial?.id ?? '');
  const [day, setDay] = useState(today);
  const [view, setView] = useState<'week' | 'day'>('day');
  const branches = [...new Set(cohorts.filter(c => c.termId === termId).map(c => c.programme))];
  const semesters = [...new Set(cohorts.filter(c => c.termId === termId && c.programme === branch).map(c => c.semester))];
  const sections = cohorts.filter(c => c.termId === termId && c.programme === branch && c.semester.toString() === semester);
  const q = useQuery({ queryKey: ['timetable', cohort], queryFn: () => api<Schedule | null>(`/timetables?cohortId=${encodeURIComponent(cohort)}`), enabled: !!cohort, staleTime: 60_000, initialData: cohort === initialCohortId ? initialSchedule : undefined });
  const schedule = q.data;
  const entries = schedule?.entries ?? [];
  const byDay = days.map((_, index) => entries.filter(e => e.weekday === index + 1));
  const state = schedule ? classState(entries, { startsOn: new Date(schedule.cohort.term.startsOn), endsOn: new Date(schedule.cohort.term.endsOn) }, new Date()) : null;
  function download() {
    if (!entries.length) return;
    const cell = (value: string) => `"${(/^[=+@-]/.test(value) ? "'" : '') + value.replaceAll('"', '""')}"`;
    const rows = [['Day', 'Time', 'Course', 'Room', 'Faculty'], ...entries.map(e => [days[e.weekday - 1], `${clock(e.startMinute)}–${clock(e.endMinute)}`, `${e.courseCode} ${e.courseTitle}`, e.room, e.instructor ?? ''])];
    const url = URL.createObjectURL(new Blob(['\uFEFF' + rows.map(row => row.map(cell).join(',')).join('\r\n')], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a'); link.href = url; link.download = 'one-place-timetable.csv'; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return <section className="schedule-panel">
    <div className="schedule-toolbar">
      <div className="schedule-selects">
        <div className="field"><label htmlFor="schedule-term">Term</label><select id="schedule-term" value={termId} onChange={e => { setTermId(e.target.value); setBranch(''); setSemester(''); setCohort(''); }}>{terms.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}</select></div>
        <div className="field"><label htmlFor="schedule-branch">Branch</label><select id="schedule-branch" value={branch} onChange={e => { setBranch(e.target.value); setSemester(''); setCohort(''); }}><option value="">Choose branch</option>{branches.map(b => <option key={b} value={b}>{branchName(b)}</option>)}</select></div>
        <div className="field"><label htmlFor="schedule-semester">Semester</label><select id="schedule-semester" disabled={!branch} value={semester} onChange={e => { setSemester(e.target.value); setCohort(''); }}><option value="">Choose semester</option>{semesters.map(s => <option key={s} value={s}>Semester {s}</option>)}</select></div>
        <div className="field"><label htmlFor="schedule-section">Section</label><select id="schedule-section" disabled={!semester} value={cohort} onChange={e => setCohort(e.target.value)}><option value="">Choose section</option>{sections.map(c => <option key={c.id} value={c.id}>{branchName(c.programme)}–{c.section}</option>)}</select></div>
      </div>
      <div className="row"><div className="schedule-toggle" role="group" aria-label="Timetable view">{(['day', 'week'] as const).map(v => <button key={v} type="button" aria-pressed={view === v} onClick={() => setView(v)}>{v === 'day' ? 'Day' : 'Week'}</button>)}</div><button type="button" className="button secondary" disabled={!entries.length} onClick={download}>↓ Download</button></div>
    </div>
    {!cohort ? <div className="empty">Choose your branch, semester, and section.</div> : q.isLoading ? <div className="empty" role="status">Loading timetable…</div> : q.error ? <div className="empty"><p>Could not load this timetable.</p><button className="button secondary" onClick={() => q.refetch()}>Try again</button></div> : !schedule ? <div className="empty">No timetable published for this section.</div> : <>
      <div className="schedule-summary"><span>{state?.kind === 'OUT_OF_TERM' ? 'Selected term is not current' : state?.kind === 'NO_CLASSES' ? 'No classes today' : state?.kind === 'DONE' ? 'Done for today' : state?.current ? `Now: ${state.current.courseCode} · ${state.current.room}` : state?.next ? `Next: ${state.next.courseCode} · ${clock(state.next.startMinute)} · ${state.next.room}` : 'Your schedule'}</span>{schedule.isDemo && <span className="tag red">Demo schedule</span>}</div>
      {view === 'day' ? <>
        <div className="schedule-day-tabs" role="group" aria-label="Day of the week">{days.map((name, i) => <button type="button" key={name} aria-pressed={day === i + 1} onClick={() => setDay(i + 1)}><strong>{name.slice(0, 3)}</strong><small>{byDay[i].length} classes</small></button>)}</div>
        <div className="row schedule-day-heading"><h2>{days[day - 1]}</h2><span className="muted">{byDay[day - 1].length} on your schedule · IST</span></div>
        <div className="schedule-class-list">{byDay[day - 1].map(e => <article className="schedule-class-row" key={e.id}><div className="schedule-time">{clock(e.startMinute)}<small>{clock(e.endMinute)}</small></div><div className={`schedule-class-content ${/lab/i.test(e.courseTitle) ? 'lab' : ''}`}><span className="eyebrow">{e.courseCode}</span><h3>{e.courseTitle}</h3><p>{e.room}{e.instructor ? ` · ${e.instructor}` : ''}</p></div></article>)}{!byDay[day - 1].length && <div className="empty">No classes scheduled for this day.</div>}</div>
      </> : <div className="schedule-week-grid">{days.map((name, i) => <section key={name}><h3>{name}</h3>{byDay[i].map(e => <article key={e.id} className={`schedule-week-class ${/lab/i.test(e.courseTitle) ? 'lab' : ''}`}><small>{clock(e.startMinute)}–{clock(e.endMinute)}</small><strong>{e.courseTitle}</strong><span>{e.courseCode} · {e.room}</span>{e.instructor && <small>{e.instructor}</small>}</article>)}{!byDay[i].length && <p className="muted">No classes</p>}</section>)}</div>}
    </>}
  </section>;
}
