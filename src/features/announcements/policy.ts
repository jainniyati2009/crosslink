export const publishedWhere = (now = new Date()) => ({ status: 'PUBLISHED' as const, publishedAt: { lte: now }, OR: [{ expiresAt: null }, { expiresAt: { gt: now } }] });
