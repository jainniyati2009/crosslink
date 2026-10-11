import { requireUser, assertOwner } from '@/lib/auth/guards.server';
import { getDiscussion } from '@/features/discussions/service.server';
import { DiscussionForm } from '@/components/forms/discussion-form';
export default async function EditDiscussion({params}:{params:Promise<{id:string}>}){const user=await requireUser();const {id}=await params;const post=await getDiscussion(id);assertOwner(user.id,post.author.id);return <><div className="page-head"><div><div className="eyebrow">Your contribution</div><h1>Edit discussion</h1></div></div><div style={{maxWidth:740}}><DiscussionForm id={id} initial={{title:post.title,body:post.body,category:post.category}}/></div></>;}
