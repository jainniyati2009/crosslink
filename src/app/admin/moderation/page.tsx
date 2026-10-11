import { moderationQueue } from '@/features/moderation/service.server';
import { ModerationManager } from '@/components/admin/moderation-manager';
import { requireAdmin } from '@/lib/auth/guards.server';
export default async function Moderation(){const actor=await requireAdmin();const data=await moderationQueue(actor.id);return <><div className="page-head"><div><div className="eyebrow">Admin desk</div><h1>Moderation</h1><p>Keep a reasoned record of each action.</p></div></div><ModerationManager {...data}/></>}
