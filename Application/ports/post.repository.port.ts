// src/application/ports/post.repository.port.ts
import type { Post } from '@/domain/entities/post';
import type { PostId, Slug } from '@/domain/value-objects/slug'; // or wherever you put them

export interface PostRepositoryPort {
  /**
   * Find a post by its unique ID
   */
  findById(id: PostId): Promise<Post | null>;

  /**
   * Find a post by its slug (unique)
   */
  findBySlug(slug: Slug): Promise<Post | null>;

  /**
   * Save (create or update) a post
   * - If exists → update
   * - If not → create
   */
  save(post: Post): Promise<void>;

  /**
   * List posts with basic pagination (expand later with filters, cursor, etc.)
   */
  list(params: {
    limit: number;
    offset?: number;
    authorId?: string;
  }): Promise<Post[]>;

  /**
   * Delete a post (soft or hard depending on your needs)
   */
  delete(id: PostId): Promise<void>;

  // Optional: count, existsBySlug, etc. for validation in use cases
}