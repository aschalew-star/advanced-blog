// src/application/use-cases/posts/create-post.use-case.ts
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid'; // or use cuid2 / your ID generator
import type { PostRepositoryPort } from '../../ports/post.repository.port';
import { Post } from '@/domain/entities/post';
import { RichTextVO } from '@/domain/value-objects/rich-text';
import { SlugVO } from '@/domain/value-objects/slug';
import { DomainError } from '@/domain/errors/domain.error';

export const CreatePostInputSchema = z.object({
  title: z.string().min(3).max(200),
  content: z.any(), // Novel/TipTap JSON — validated in VO
  authorId: z.string().cuid2(),
  // Optional: tags: z.array(z.string()).optional(),
  // imageUrl: z.string().url().optional(), // cover image
});

export type CreatePostInput = z.infer<typeof CreatePostInputSchema>;

export type CreatePostOutput =
  | { success: true; postId: string; slug: string }
  | { success: false; error: string | Record<string, string[]> };

export class CreatePostUseCase {
  constructor(private readonly postRepository: PostRepositoryPort) {}

  async execute(rawInput: unknown): Promise<CreatePostOutput> {
    // 1. Validate input DTO
    const parseResult = CreatePostInputSchema.safeParse(rawInput);
    if (!parseResult.success) {
      return { success: false, error: parseResult.error.flatten().fieldErrors };
    }

    const input = parseResult.data;

    try {
      // 2. Create domain entity (this runs VO validations)
      const post = Post.create({
        id: uuidv4(), // or prisma will generate on save if preferred
        title: input.title,
        content: input.content,
        authorId: input.authorId,
      });

      // 3. Persist via port
      await this.postRepository.save(post);

      return {
        success: true,
        postId: post.id,
        slug: post.slug.toString(),
      };
    } catch (err) {
      if (err instanceof DomainError) {
        return { success: false, error: err.message };
      }
      console.error(err);
      return { success: false, error: 'Failed to create post' };
    }
  }
}