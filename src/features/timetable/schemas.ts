import { z } from 'zod';
export const entryInput = z.object({ weekday: z.number().int().min(1).max(7), startMinute: z.number().int().min(0).max(1439), endMinute: z.number().int().min(1).max(1440), courseCode: z.string().trim().min(1).max(30), courseTitle: z.string().trim().min(1).max(120), room: z.string().trim().min(1).max(80), instructor: z.string().trim().max(100).nullable().optional() }).strict().refine(e => e.startMinute < e.endMinute, 'End time must follow start time.');
export const scheduleInput = z.object({ cohortId: z.string().min(1), entries: z.array(entryInput).max(100) });
export const replaceInput = z.object({ expectedVersion: z.number().int().min(1), entries: z.array(entryInput).max(100) });
export function validateEntries(entries: z.infer<typeof entryInput>[]) {
  const sorted = [...entries].sort((a, b) => a.weekday - b.weekday || a.startMinute - b.startMinute);
  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i].weekday === sorted[i - 1].weekday && sorted[i].startMinute < sorted[i - 1].endMinute) return false;
  }
  return true;
}
export function classState<T extends { weekday: number; startMinute: number; endMinute: number }>(entries: T[], term: { startsOn: Date; endsOn: Date }, now: Date) {
  const parts = new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(now);
  const value = (type: string) => Number(parts.find(p => p.type === type)?.value);
  const dateOnly = new Date(Date.UTC(value('year'), value('month') - 1, value('day')));
  if (dateOnly < term.startsOn || dateOnly > term.endsOn) return { kind: 'OUT_OF_TERM' as const };
  const weekdayName = new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Kolkata', weekday: 'short' }).format(now);
  const weekday = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].indexOf(weekdayName) || 7;
  const clock = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).format(now).split(':').map(Number);
  const minute = clock[0] * 60 + clock[1];
  const today = entries.filter(e => e.weekday === weekday).sort((a, b) => a.startMinute - b.startMinute);
  if (!today.length) return { kind: 'NO_CLASSES' as const };
  const current = today.find(e => e.startMinute <= minute && minute < e.endMinute);
  const next = today.find(e => e.startMinute > minute);
  return { kind: current ? 'IN_CLASS' as const : next ? 'BETWEEN' as const : 'DONE' as const, current, next, freeMinutes: next ? next.startMinute - (current?.endMinute ?? minute) : null };
}
