const sourceUrl = 'https://www.imsnsit.org/imsnsit/notifications.php';

const notices = [
  { date: '09 Oct 2026', title: 'Inauguration of Yashaswini Girls Hostel (East Campus)', department: 'East Campus' },
  { date: '07 Oct 2026', title: 'PhD pre-submission seminar — Mechanical Engineering', department: 'Mechanical Engineering' },
  { date: '07 Oct 2026', title: 'MBA Major Project', department: 'Management Studies' },
  { date: '06 Oct 2026', title: 'Innerverse — the Annual Mental Health Week Fest 2026', department: 'Humanities and Social Sciences' },
  { date: '06 Oct 2026', title: 'Library Services Feedback', department: 'Library' },
  { date: '06 Oct 2026', title: 'MBA specialisation (for upcoming 2nd semester)', department: 'Management Studies' },
];

export function OfficialNotices({ compact = false }: { compact?: boolean }) {
  const shown = compact ? notices.slice(0, 3) : notices;

  return <section className="card official-notices" aria-labelledby={compact ? 'official-notices-feed' : 'official-notices-page'}>
    <div className="row official-notices-heading">
      <div>
        <div className="eyebrow">NSUT</div>
        <h2 id={compact ? 'official-notices-feed' : 'official-notices-page'}>{compact ? 'Recent campus notices' : 'Notices and circulars'}</h2>
      </div>
      <a className="button secondary" href={sourceUrl} target="_blank" rel="noreferrer">All notices ↗</a>
    </div>
    <ul className="official-notice-list">
      {shown.map(notice => <li key={`${notice.date}-${notice.title}`}>
        <div><strong>{notice.title}</strong><small>{notice.department}</small></div>
        <time>{notice.date}</time>
      </li>)}
    </ul>
  </section>;
}
