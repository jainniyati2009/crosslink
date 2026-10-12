import { AttendancePlanner } from '@/components/attendance-planner';

export default function AttendancePage() {
  return <>
    <div className="page-head"><div><div className="eyebrow">Keep your week on track</div><h1>Attendance</h1><p>Track each subject against the 75% goal.</p></div></div>
    <AttendancePlanner />
  </>;
}
