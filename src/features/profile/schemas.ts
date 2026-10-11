import { z } from 'zod';
export const profileInput = z.object({ name: z.string().trim().min(2).max(60).optional(), bio: z.string().trim().max(240).optional(), selectedCohortId: z.string().nullable().optional() }).strict();
