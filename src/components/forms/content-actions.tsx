'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { api } from '@/components/api';
export function ContentActions({ kind, id, discussionId, initialBody }: { kind: 'discussion'|'reply'; id: string; discussionId?: string; initialBody?: string }) {
  const router=useRouter(); const [editing,setEditing]=useState(false); const [body,setBody]=useState(initialBody??'');
  const path=kind==='discussion'?`/discussions/${id}`:`/replies/${id}`;
  const remove=useMutation({mutationFn:()=>api(path,'DELETE',{}),onSuccess:()=>{router.push(kind==='discussion'?'/discussions':`/discussions/${discussionId}`);router.refresh();}});
  const save=useMutation({mutationFn:()=>api(path,'PATCH',{body}),onSuccess:()=>{setEditing(false);router.refresh();}});
  return <div>{kind==='reply'&&<button className="button text" onClick={()=>setEditing(!editing)}>{editing?'Cancel':'Edit'}</button>}<button className="button text" onClick={()=>{if(confirm('Delete this content?'))remove.mutate();}} disabled={remove.isPending}>Delete</button>{editing&&<form className="form" onSubmit={e=>{e.preventDefault();save.mutate();}}><div className="field"><label htmlFor={`edit-${id}`}>Edit reply</label><textarea id={`edit-${id}`} value={body} onChange={e=>setBody(e.target.value)} required maxLength={2000}/></div><button className="button" disabled={save.isPending}>Save reply</button></form>}{(remove.error||save.error)&&<p className="error" role="alert">{remove.error?.message??save.error?.message}</p>}</div>;
}
