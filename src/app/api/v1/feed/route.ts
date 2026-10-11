import { requireUser } from '@/lib/auth/guards.server';
import { ok } from '@/lib/api-errors';
import { route } from '@/lib/route';
import { listDiscussions, parseList } from '@/features/discussions/service.server';
import { listAnnouncements } from '@/features/announcements/service.server';
export const runtime = 'nodejs';
export const GET = route(async request => { await requireUser(); const [discussions, notices] = await Promise.all([listDiscussions(parseList(request.url)), listAnnouncements()]); return ok({ discussions: discussions.data, pinnedAnnouncements: notices.filter(n => n.isPinned) }, 200, { nextCursor: discussions.nextCursor }); });
