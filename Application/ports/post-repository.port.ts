// src/domains/post/application/ports/post-repository.port.ts

import { Post } from '@/domains/post/domain/entities/post';

export interface PostRepository {
  findById(id: number): Promise<Post | null>;
  findBySlug(slug: string): Promise<Post | null>;

  save(post: Post): Promise<Post>;
  update(post: Post): Promise<Post>;
  delete(id: number): Promise<void>;

  // Common queries
  findByAuthor(authorId: number, options?: { skip?: number; take?: number }): Promise<Post[]>;
  incrementViews(id: number): Promise<void>;
}