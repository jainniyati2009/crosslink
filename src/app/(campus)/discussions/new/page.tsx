import { DiscussionForm } from '@/components/forms/discussion-form';
export default function NewDiscussion() { return <><div className="page-head"><div><div className="eyebrow">Discussions</div><h1>New discussion</h1><p>Ask a question or share an update.</p></div></div><div style={{maxWidth:740}}><DiscussionForm/></div></>; }
