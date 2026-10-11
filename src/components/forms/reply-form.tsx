'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { api } from '@/components/api';
export function ReplyForm({ id }: { id: string }) { const [body,setBody]=useState(''); const router=useRouter(); const m=useMutation({mutationFn:()=>api(`/discussions/${id}/replies`,'POST',{body}),onSuccess:()=>{setBody('');router.refresh();}}); return <form className="card form" onSubmit={e=>{e.preventDefault();m.mutate();}}><div className="field"><label htmlFor="reply">Add a reply</label><textarea id="reply" value={body} onChange={e=>setBody(e.target.value)} maxLength={2000} required rows={4} placeholder="Add to the conversation…"/></div>{m.error && <p className="error" role="alert">{m.error.message}</p>}<div><button className="button" disabled={m.isPending}>{m.isPending?'Posting…':'Post reply'}</button></div></form>; }
