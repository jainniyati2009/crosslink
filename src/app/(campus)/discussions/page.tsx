import Link from 'next/link';
import { requireUser } from '@/lib/auth/guards.server';
import { listDiscussions } from '@/features/discussions/service.server';
import { DiscussionCard } from '@/components/ui/discussion-card';
import { category } from '@/features/discussions/schemas';
export default async function Discussions({ searchParams }: { searchParams: Promise<{ q?: string; category?: string; cursor?: string }> }) {
  await requireUser(); const p = await searchParams;
  const selected = category.safeParse(p.category);
  const result = await listDiscussions({ q: p.q, category: selected.success ? selected.data : undefined, cursor: p.cursor, limit: 20 });
  const next = new URLSearchParams({ ...(p.q ? { q: p.q } : {}), ...(selected.success ? { category: selected.data } : {}), ...(result.nextCursor ? { cursor: result.nextCursor } : {}) });
  return <><div className="page-head"><div><div className="eyebrow">Campus</div><h1>Discussions</h1><p>Ask a question or share a campus update.</p></div><Link className="button" href="/discussions/new">＋ New discussion</Link></div><form className="filters" action="/discussions"><input className="search" type="search" name="q" aria-label="Search discussions" placeholder="Search discussions…" defaultValue={p.q ?? ''}/><select className="search" name="category" aria-label="Filter by category" defaultValue={selected.success ? selected.data : ''}><option value="">All categories</option>{category.options.map(c => <option key={c} value={c}>{c.charAt(0)+c.slice(1).toLowerCase()}</option>)}</select><button className="button secondary" type="submit">Filter</button></form><div className="stack">{result.data.map(post => <DiscussionCard discussion={post} key={post.id}/>)}{!result.data.length && <div className="empty">No discussions found.</div>}{result.nextCursor && <Link className="button secondary" href={`/discussions?${next}`}>More discussions</Link>}</div></>;
}
