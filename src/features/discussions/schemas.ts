import { z } from 'zod';
export const category = z.enum(['CAMPUS', 'ACADEMICS', 'QUESTION', 'RESOURCE']);
export const discussionInput = z.object({ title: z.string().trim().min(3).max(140), body: z.string().trim().min(1).max(10000), category });
export const discussionEdit = discussionInput.partial().refine(v => Object.keys(v).length > 0);
export const replyInput = z.object({ body: z.string().trim().min(1).max(2000) });
export const listInput = z.object({ q: z.string().trim().max(100).optional(), category: category.optional(), cursor: z.string().min(1).max(100).regex(/^[A-Za-z0-9_-]+$/).optional(), limit: z.coerce.number().int().min(1).max(50).default(20) });
