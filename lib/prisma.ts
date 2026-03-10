import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'            // or use Pg.Pool if you prefer

// Optional: better pooling control (recommended)
const connectionString = process.env.DATABASE_URL!

const pool = new Pool({ connectionString })

const adapter = new PrismaPg(pool)   // ← this is the key change

declare global {
  var prisma: PrismaClient | undefined;
}

const prisma = global.prisma || new PrismaClient({
  log: ['query', 'error', 'warn'],
  adapter,                           // ← required in Prisma 7
})

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma
}

export default prisma