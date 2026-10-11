import { DiscussionForm } from '@/components/forms/discussion-form';
export default function NewDiscussion() { return <><div className="page-head"><div><div className="eyebrow">Start a conversation</div><h1>New discussion</h1><p>Share a question, resource, or campus update.</p></div></div><div style={{maxWidth:740}}><DiscussionForm/></div></>; }
