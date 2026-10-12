export default function AttendancePage() {
  return <>
    <div className="page-head"><div><div className="eyebrow">One Place</div><h1>Attendance</h1></div></div>
    <section className="card attendance-upcoming" aria-labelledby="attendance-status">
      <div className="row"><h2 id="attendance-status">Attendance tracking</h2><span className="tag">Coming soon</span></div>
      <div className="attendance-status-bar" aria-hidden="true" />
      <p>We are improving One Place. Attendance tracking is under development and will be available in a future update.</p>
    </section>
  </>;
}
