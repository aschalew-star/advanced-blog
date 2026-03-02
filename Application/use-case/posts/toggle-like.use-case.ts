// src/application/use-cases/posts/toggle-like.use-case.ts (updated)
export class ToggleLikeUseCase {
  constructor(
    private readonly postRepository: PostRepositoryPort,
    private readonly notification: NotificationPort, // ← added
  ) {}

  async execute(rawInput: unknown): Promise<ToggleLikeOutput> {
    // ... existing code ...

    if (event) {
      await this.postRepository.save(post);

      // Publish event (decoupled!)
      await this.notification.publish(event);

      return { success: true, liked: true, event };
    }

    // ...
  }
}