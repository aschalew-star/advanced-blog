// src/infrastructure/external/socket-io/notification.emitter.adapter.ts
import { Server as SocketServer } from 'socket.io';
import type { NotificationPort } from '@/application/ports/notification.port';
import type { PostLikedDomainEvent } from '@/domain/domain-events/post-liked';

export class SocketNotificationEmitter implements NotificationPort {
  constructor(private readonly io: SocketServer) {}

  async publish(event: PostLikedDomainEvent): Promise<void> {
    // Emit to a room specific to the post author
    // Client will join `user:${authorId}` on connect/auth
    this.io.to(`user:${event.postAuthorId}`).emit('notification', {
      type: 'like',
      postId: event.postId,
      likerId: event.likerId,
      message: `Someone liked your post!`,
      occurredAt: event.occurredOn.toISOString(),
    });

    // Optional: persist to DB via another port/use-case if needed
    // e.g. await this.notificationRepo.saveFromEvent(event);
  }
}