export class PostLikedDomainEvent {
  public readonly occurredOn: Date = new Date();

  constructor(
    public readonly postId: string,
    public readonly likerId: string,
    public readonly postAuthorId: string,
    public readonly metadata?: Record<string, unknown> // e.g. { ip: "...", timestamp: ... }
  ) {}

  // Optional: serialization for event store / pub/sub later
  toJSON() {
    return {
      type: 'PostLiked',
      payload: {
        postId: this.postId,
        likerId: this.likerId,
        postAuthorId: this.postAuthorId,
        occurredOn: this.occurredOn.toISOString(),
        ...this.metadata,
      },
    };
  }
}