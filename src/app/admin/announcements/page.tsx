import { listAdminAnnouncements } from '@/features/announcements/service.server';
import { AnnouncementManager } from '@/components/admin/announcement-manager';
import { requireAdmin } from '@/lib/auth/guards.server';
export default async function AdminAnnouncements(){const actor=await requireAdmin();const notices=await listAdminAnnouncements(actor.id);return <><div className="page-head"><div><div className="eyebrow">Admin desk</div><h1>Announcements</h1><p>Draft, publish, and maintain campus notices.</p></div></div><AnnouncementManager notices={notices.map(n=>({...n,expiresAt:n.expiresAt?.toISOString()??null}))}/></>}
