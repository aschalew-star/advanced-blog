// src/presentation/trpc/composition.ts
import { PrismaPostRepository } from '@/infrastructure/persistence/prisma/post.repository.impl';
import { SocketNotificationEmitter } from '@/infrastructure/external/socket-io/notification.emitter.adapter';
import { ToggleLikeUseCase } from '@/application/use-cases/posts/toggle-like.use-case';

// Assume io is available globally or injected
const io = (global as any).socketIo as Server; // from server.ts

export const createUseCases = () => {
  const postRepo = new PrismaPostRepository();
  const notification = new SocketNotificationEmitter(io);

  return {
    toggleLike: new ToggleLikeUseCase(postRepo, notification),
    // add more use cases here...
  };
};