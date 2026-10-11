'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { api } from '@/components/api';
export function DiscussionForm({ initial, id }: { initial?: { title: string; body: string; category: string }; id?: string }) {
  const router = useRouter(); const [title,setTitle] = useState(initial?.title ?? ''); const [body,setBody] = useState(initial?.body ?? ''); const [category,setCategory] = useState(initial?.category ?? 'CAMPUS');
  const mutation = useMutation({ mutationFn: () => api<{id:string}>(id ? `/discussions/${id}` : '/discussions', id ? 'PATCH' : 'POST', { title, body, category }), onSuccess: data => { router.push(`/discussions/${data.id}`); router.refresh(); } });
  return <form className="card form" onSubmit={e => { e.preventDefault(); mutation.mutate(); }}><div className="field"><label htmlFor="title">Title</label><input id="title" value={title} onChange={e=>setTitle(e.target.value)} required minLength={3} maxLength={140}/></div><div className="field"><label htmlFor="category">Category</label><select id="category" value={category} onChange={e=>setCategory(e.target.value)}>{['CAMPUS','ACADEMICS','QUESTION','RESOURCE'].map(c=><option key={c}>{c}</option>)}</select></div><div className="field"><label htmlFor="body">Your post</label><textarea id="body" value={body} onChange={e=>setBody(e.target.value)} required maxLength={10000} rows={9}/><span className="field-help">Plain text. Be kind and keep it useful.</span></div>{mutation.error && <p className="error" role="alert">{mutation.error.message}</p>}<div><button className="button" disabled={mutation.isPending}>{mutation.isPending ? 'Saving…' : id ? 'Save changes' : 'Publish discussion'}</button></div></form>;
}
