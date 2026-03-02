// prisma.config.ts
import "dotenv/config";           // ← important: loads your .env file
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",   // or wherever your schema is
  migrations: {
    path: "prisma/migrations",      // default, can customize
    // seed: "ts-node prisma/seed.ts",   // if you have a seed script
  },
  datasource: {
    url: env("DATABASE_URL"),       // ← this is where it belongs now
  },
});