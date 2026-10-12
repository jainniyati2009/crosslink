import Image from 'next/image';
import Link from 'next/link';
import { requireUser } from '@/lib/auth/guards.server';
import { listDiscussions } from '@/features/discussions/service.server';
import { listPinnedAnnouncements } from '@/features/announcements/service.server';
import { getTimetableByCohort } from '@/features/timetable/service.server';
import { classState } from '@/features/timetable/schemas';
import { DiscussionCard } from '@/components/ui/discussion-card';
import { redirect } from 'next/navigation';
import { OfficialNotices } from '@/components/official-notices';

const campusPhoto = 'https://upload.wikimedia.org/wikipedia/commons/5/51/NSUT_%28formerly_NSIT%29.jpg';

export default async function Feed({ searchParams }: { searchParams: Promise<{ cursor?: string }> }) {
  const user = await requireUser();
  if (!user.onboardingCompletedAt) redirect('/onboarding');
  const { cursor } = await searchParams;
  const [posts, notices, schedule] = await Promise.all([
    listDiscussions({ limit: 20, cursor }),
    listPinnedAnnouncements(),
    user.selectedCohortId ? getTimetableByCohort(user.selectedCohortId) : null,
  ]);
  const state = schedule ? classState(schedule.entries, schedule.cohort.term, new Date()) : null;
  const date = new Intl.DateTimeFormat('en-IN', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'Asia/Kolkata' }).format(new Date());

  return <>
    <section className="dashboard-hero">
      <div className="dashboard-copy">
        <div className="eyebrow"><span className="live-dot" />{date}</div>
        <h1>One Place</h1>
        <p>Your campus day, all in one view.</p>
        <div className="hero-actions">
          <Link className="button" href="/discussions/new"><span aria-hidden>＋</span> Start a discussion</Link>
          <Link className="hero-text-link" href="/timetable">See your day <span aria-hidden>→</span></Link>
        </div>
      </div>
      <div className="dashboard-visual">
        <Image src={campusPhoto} alt="The central courtyard at Netaji Subhas University of Technology" fill priority unoptimized sizes="(max-width: 767px) 100vw, 55vw" />
        <div className="visual-caption"><span>YOUR CAMPUS, TOGETHER</span><a href="https://commons.wikimedia.org/wiki/File:NSUT_(formerly_NSIT).jpg" target="_blank" rel="noreferrer">Photo: Lavishsinhmar307 · CC BY-SA 4.0 ↗</a></div>
      </div>
    </section>

    <nav className="quick-links" aria-label="Browse campus">
      <span>Browse</span><Link href="/timetable">Timetable</Link><Link href="/announcements">Notices</Link>
      <Link href="/discussions?category=ACADEMICS">Academics</Link><Link href="/discussions?category=QUESTION">Questions</Link><Link href="/discussions?category=RESOURCE">Resources</Link>
    </nav>

    <div className="feed-grid">
      <section className="stack" aria-label="Recent discussions">
        {notices.slice(0, 1).map(notice => <Link href={`/announcements/${notice.id}`} className="card notice-strip" key={notice.id}>
          <span className="tag red">Pinned notice {notice.isDemo ? '· Demo' : ''}</span><h2 className="pinned-title">{notice.title}</h2><small>Read notice →</small>
        </Link>)}
        <div className="feed-section-heading"><div><div className="eyebrow">DISCUSSIONS</div><h2 className="section-title">Recent discussions</h2></div><span className="feed-count">{posts.data.length}</span></div>
        {posts.data.map(post => <DiscussionCard discussion={post} key={post.id} />)}
        {!posts.data.length && <div className="empty"><span className="empty-mark">◈</span><strong>No discussions yet.</strong><Link className="button" href="/discussions/new">Start a discussion</Link></div>}
        {posts.nextCursor && <Link href={`/feed?cursor=${posts.nextCursor}`} className="button secondary">Older discussions</Link>}
      </section>

      <aside className="sidebar">
        <div className="card day-card"><div className="eyebrow">TODAY</div><h3>Class schedule</h3>
          {!user.selectedCohortId ? <p className="muted">Choose your section to see your classes.</p>
            : !schedule ? <p className="muted">No timetable published yet.</p>
              : state?.kind === 'OUT_OF_TERM' ? <p className="muted">No current classes in this term.</p>
                : state?.kind === 'NO_CLASSES' ? <p className="muted">No classes today.</p>
                  : state?.kind === 'DONE' ? <p className="muted">No more classes today.</p>
                    : <><p><strong>{state?.current ? 'Now' : 'Next'}:</strong> {(state?.current ?? state?.next)?.courseCode} · {(state?.current ?? state?.next)?.courseTitle}</p>
                      {state?.next && <small>Next at {String(Math.floor(state.next.startMinute / 60)).padStart(2, '0')}:{String(state.next.startMinute % 60).padStart(2, '0')}</small>}
                      {state?.freeMinutes !== null && state?.freeMinutes !== undefined && <p className="muted">Between classes: {state.freeMinutes} min</p>}</>}
          <Link href="/timetable" className="button text">View timetable <span aria-hidden>→</span></Link>
        </div>
        <OfficialNotices compact />
        <div className="card pinned"><div className="eyebrow">NOTICEBOARD</div><h3>Pinned notices</h3>
          {notices.slice(0, 4).map(notice => <Link href={`/announcements/${notice.id}`} className="line-item" key={notice.id}><strong>{notice.title}</strong><small>{notice.category} {notice.isDemo ? '· Demo' : ''}</small></Link>)}
          {!notices.length && <p className="muted">No pinned notices.</p>}<Link className="button text" href="/announcements">All notices →</Link>
        </div>
      </aside>
    </div>
  </>;
}
