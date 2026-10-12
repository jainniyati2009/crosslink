import Link from 'next/link';
import { requireUser } from '@/lib/auth/guards.server';
import { listDiscussions } from '@/features/discussions/service.server';
import { listAnnouncements } from '@/features/announcements/service.server';
import { DiscussionCard } from '@/components/ui/discussion-card';

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  await requireUser();
  const q = (await searchParams).q?.trim().slice(0, 100) ?? '';
  const [discussions, notices] = q
    ? await Promise.all([listDiscussions({ q, limit: 8 }), listAnnouncements(undefined, q)])
    : [{ data: [], nextCursor: null }, []];

  return <>
    <div className="page-head"><div><div className="eyebrow">Campus search</div><h1>Search One Place</h1><p>Find discussions and campus notices.</p></div></div>
    <form className="global-search search-page-form" action="/search"><label className="hidden" htmlFor="page-search">Search discussions and notices</label><span aria-hidden>⌕</span><input id="page-search" name="q" type="search" placeholder="Try a course, event, or question" defaultValue={q}/><button type="submit">Search</button></form>
    {!q ? <div className="search-suggestions"><h2>Explore</h2><div className="quick-links"><Link href="/announcements">All notices</Link><Link href="/discussions?category=ACADEMICS">Academics</Link><Link href="/discussions?category=QUESTION">Questions</Link><Link href="/discussions?category=RESOURCE">Resources</Link></div></div> : <div className="search-results">
      <section className="stack"><div className="feed-section-heading"><div><div className="eyebrow">STUDENT COMMUNITY</div><h2 className="section-title">Discussions</h2></div><span className="feed-count">{discussions.data.length}</span></div>{discussions.data.map(post => <DiscussionCard discussion={post} key={post.id}/>)}{!discussions.data.length && <p className="muted">No matching discussions.</p>}</section>
      <section className="stack"><div className="feed-section-heading"><div><div className="eyebrow">CAMPUS UPDATES</div><h2 className="section-title">Notices</h2></div><span className="feed-count">{notices.length}</span></div>{notices.slice(0, 8).map(notice => <Link className="card search-result" href={`/announcements/${notice.id}`} key={notice.id}><span className="tag">{notice.category.toLowerCase()}</span><h3>{notice.title}</h3><p>{notice.body.slice(0, 150)}{notice.body.length > 150 ? '…' : ''}</p></Link>)}{!notices.length && <p className="muted">No matching notices.</p>}</section>
    </div>}
  </>;
}
