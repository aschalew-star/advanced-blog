import type { PostLikedDomainEvent } from '@/domain/domain-events/post-liked';

export interface NotificationPort {
  publish(event: PostLikedDomainEvent): Promise<void>;
  // Later: publishCommentCreated, sendEmail, pushWebNotification, etc.
}