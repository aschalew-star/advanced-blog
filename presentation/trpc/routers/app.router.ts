// src/presentation/trpc/routers/app.router.ts
import { router } from '../trpc.server';
import { postRouter } from './post.router';
// import { commentRouter, userRouter, ... } later

export const appRouter = router({
  post: postRouter,
  // comment: commentRouter,
  // etc.
});

export type AppRouter = typeof appRouter;