'use client';

import { FormEvent, useEffect, useState } from 'react';
import { attendancePercent, classesCanMiss, classesNeededToReachGoal } from '@/features/attendance/policy';

type SubjectRecord = { id: string; subject: string; attended: number; held: number };
const storageKey = 'nsut-connect-attendance-v1';

function readRecords(): SubjectRecord[] {
  try {
    const value: unknown = JSON.parse(window.localStorage.getItem(storageKey) ?? '[]');
    if (!Array.isArray(value)) return [];
    return value.filter((item): item is SubjectRecord => item && typeof item.id === 'string' && typeof item.subject === 'string' && Number.isInteger(item.attended) && Number.isInteger(item.held) && item.held > 0 && item.attended >= 0 && item.attended <= item.held);
  } catch {
    return [];
  }
}

export function AttendancePlanner() {
  const [records, setRecords] = useState<SubjectRecord[]>([]);
  const [ready, setReady] = useState(false);
  const [subject, setSubject] = useState('');
  const [attended, setAttended] = useState('');
  const [held, setHeld] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    setRecords(readRecords());
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) window.localStorage.setItem(storageKey, JSON.stringify(records));
  }, [ready, records]);

  function addSubject(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const attendedCount = Number(attended);
    const heldCount = Number(held);
    if (!subject.trim() || !Number.isInteger(attendedCount) || !Number.isInteger(heldCount) || heldCount < 1 || attendedCount < 0 || attendedCount > heldCount) {
      setError('Enter a subject and valid attended / total class counts.');
      return;
    }
    setError('');
    setRecords((current) => [...current, { id: crypto.randomUUID(), subject: subject.trim(), attended: attendedCount, held: heldCount }]);
    setSubject(''); setAttended(''); setHeld('');
  }

  return <div className="attendance-layout">
    <form className="card form attendance-form" onSubmit={addSubject}>
      <div><div className="eyebrow">Your numbers</div><h2>Add a subject</h2><p className="muted">Enter the counts shown on your attendance record.</p></div>
      <div className="field"><label htmlFor="attendance-subject">Subject</label><input id="attendance-subject" value={subject} onChange={(event) => setSubject(event.target.value)} maxLength={80} placeholder="e.g. Data Structures" required /></div>
      <div className="attendance-count-fields">
        <div className="field"><label htmlFor="attendance-attended">Classes attended</label><input id="attendance-attended" type="number" min="0" step="1" value={attended} onChange={(event) => setAttended(event.target.value)} required /></div>
        <div className="field"><label htmlFor="attendance-held">Classes held</label><input id="attendance-held" type="number" min="1" step="1" value={held} onChange={(event) => setHeld(event.target.value)} required /></div>
      </div>
      {error && <p className="error" role="alert">{error}</p>}
      <button className="button" type="submit" disabled={!ready}>Add attendance</button>
      <p className="field-help">Saved in this browser. No UMS password is needed.</p>
    </form>
    <section className="attendance-results" aria-label="Subject attendance">
      <div className="row attendance-list-heading"><h2>Your subjects</h2>{records.length > 0 && <span className="feed-count">{records.length}</span>}</div>
      {!ready ? <div className="empty">Loading your saved subjects…</div> : records.length === 0 ? <div className="empty"><span className="empty-mark" aria-hidden="true">◷</span><strong>No subjects added yet</strong><span>Add class counts to see your attendance and the 75% target.</span></div> : <div className="stack">{records.map((record) => {
        const percent = attendancePercent(record.attended, record.held);
        const needed = classesNeededToReachGoal(record.attended, record.held);
        const canMiss = classesCanMiss(record.attended, record.held);
        return <article key={record.id} className="card attendance-card">
          <div className="row attendance-card-heading"><h3>{record.subject}</h3><button className="button text attendance-delete" type="button" aria-label={`Remove ${record.subject}`} onClick={() => setRecords((current) => current.filter((item) => item.id !== record.id))}>Remove</button></div>
          <div className="attendance-stat"><strong>{percent.toFixed(1)}%</strong><span>{record.attended} of {record.held} classes attended</span></div>
          <div className="attendance-meter" role="meter" aria-label={`${record.subject} attendance`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.min(percent, 100)}><span style={{ width: `${Math.min(percent, 100)}%` }} /></div>
          <p className={percent >= 75 ? 'attendance-guidance on-track' : 'attendance-guidance'}>{percent >= 75 ? canMiss === 0 ? 'At the 75% goal. Attend the next class to keep a buffer.' : `You can miss ${canMiss} more ${canMiss === 1 ? 'class' : 'classes'} and stay at 75%.` : `Attend the next ${needed} ${needed === 1 ? 'class' : 'classes'} to reach 75%.`}</p>
        </article>;
      })}</div>}
    </section>
  </div>;
}
