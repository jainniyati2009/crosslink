import { requireAdmin } from '@/lib/auth/guards.server';
import { ok } from '@/lib/api-errors';
import { route } from '@/lib/route';
import { listAdminAnnouncements } from '@/features/announcements/service.server';
export const runtime = 'nodejs';
export const GET = route(async () => { const actor = await requireAdmin(); return ok(await listAdminAnnouncements(actor.id)); });
