import 'server-only';
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient; prismaConfigVersion?: number };
export const db = globalForPrisma.prisma && globalForPrisma.prismaConfigVersion === 1
  ? globalForPrisma.prisma
  : new PrismaClient({ datasourceUrl: process.env.DATABASE_URL });
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = db;
  globalForPrisma.prismaConfigVersion = 1;
}
