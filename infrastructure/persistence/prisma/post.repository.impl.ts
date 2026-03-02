// src/infrastructure/persistence/prisma/post.repository.impl.ts
import { prisma } from '@/infrastructure/database/prisma.client';
import type { PostRepositoryPort } from '@/application/ports/post.repository.port';
import { Post } from '@/domain/entities/post';
import { SlugVO } from '@/domain/value-objects/slug';
import { RichTextVO } from '@/domain/value-objects/rich-text';
import { DomainError } from '@/domain/errors/domain.error';

export class PrismaPostRepository implements PostRepositoryPort {
  async findById(id: string): Promise<Post | null> {
    const record = await prisma.post.findUnique({
      where: { id },
      include: {
        likes: { select: { userId: true } }, // to hydrate likes Set
      },
    });

    if (!record) return null;

    return this.toDomain(record);
  }

  async findBySlug(slug: string): Promise<Post | null> {
    const record = await prisma.post.findUnique({
      where: { slug },
      include: { likes: { select: { userId: true } } },
    });

    if (!record) return null;

    return this.toDomain(record);
  }

  async save(post: Post): Promise<void> {
    const data = this.toPersistence(post);

    await prisma.post.upsert({
      where: { id: post.id },
      update: data,
      create: {
        ...data,
        id: post.id, // ensure ID is set on create
      },
    });
  }

  async list(params: { limit: number; offset?: number; authorId?: string }): Promise<Post[]> {
    const records = await prisma.post.findMany({
      take: params.limit,
      skip: params.offset ?? 0,
      where: params.authorId ? { authorId: params.authorId } : undefined,
      orderBy: { createdAt: 'desc' },
      include: { likes: { select: { userId: true } } },
    });

    return records.map((r) => this.toDomain(r));
  }

  async delete(id: string): Promise<void> {
    await prisma.post.delete({ where: { id } });
  }

  // ── Mappers ────────────────────────────────────────────────────────────────

  private toDomain(record: any): Post {
    const likes = record.likes?.map((l: any) => l.userId) ?? [];

    return new Post(
      record.id,
      SlugVO.fromPersistence(record.slug),
      record.title,
      RichTextVO.fromPersistence(record.content),
      record.authorId,
      likes,
      record.createdAt,
      record.updatedAt
    );
  }

  private toPersistence(post: Post): any {
    return {
      slug: post.slug.toString(),
      title: post.title,
      content: post.content.json, // Novel/TipTap JSON
      authorId: post.authorId,
      updatedAt: post.updatedAt,
      // Note: likes are managed via separate Like model relations
      // We don't persist _likes Set directly — handled in toggle-like logic
    };
  }
}