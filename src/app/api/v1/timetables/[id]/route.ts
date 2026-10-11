import { requireUser } from '@/lib/auth/guards.server';
import { ok } from '@/lib/api-errors';
import { route } from '@/lib/route';
import { getTimetable } from '@/features/timetable/service.server';
export const runtime = 'nodejs';
export const GET = route(async (_request, { params }: { params: Promise<{ id: string }> }) => { await requireUser(); return ok(await getTimetable((await params).id)); });
