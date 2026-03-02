// src/presentation/trpc/trpc.server.ts
import { initTRPC, TRPCError } from '@trpc/server';
import superjson from 'superjson';
import { type inferAsyncReturnType } from '@trpc/server';
import { type Session } from 'next-auth';
import { auth } from '@/lib/auth'; // your Auth.js export
import { createUseCases } from './composition'; // from earlier

// ── Context ────────────────────────────────────────────────────────────────
type CreateContextOptions = {
  session: Session | null;
};

export const createTRPCContext = async (opts: CreateContextOptions) => {
  const useCases = createUseCases(); // concrete use cases with ports/adapters

  return {
    session: opts.session,
    useCases, // inject all use cases here
  };
};

export type TRPCContext = inferAsyncReturnType<typeof createTRPCContext>;

// ── tRPC Init ──────────────────────────────────────────────────────────────
const t = initTRPC.context<TRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape }) {
    return shape;
  },
});

// ── Auth Middleware ────────────────────────────────────────────────────────
const isAuthed = t.middleware(async ({ ctx, next }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  return next({
    ctx: {
      session: ctx.session, // type-safe user
    },
  });
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(isAuthed);