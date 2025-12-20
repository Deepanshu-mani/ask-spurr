import 'dotenv/config'; // Load env vars FIRST
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

// Create a shared pg pool using your DATABASE_URL
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

// Wrap the pool in a Prisma adapter
const adapter = new PrismaPg(pool);

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
    globalForPrisma.prisma ??
    new PrismaClient({
        adapter, // <- this satisfies the Prisma 7 engine requirement
        log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    });

if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma;
}