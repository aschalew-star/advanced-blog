// src/lib/trpc/trpc.client.ts
'use client';

import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from '@/presentation/trpc/routers/app.router';

export const trpc = createTRPCReact<AppRouter, any, null>();