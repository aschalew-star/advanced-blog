import { Post } from "@/domain/entities/post";
import { PostRepository } from "@/Application/ports/post.repository.port";
import prisma from "@/lib/prisma";
import { Select } from "radix-ui";

export class PrismaPostRepository implements PostRepository {
  async findById(id: number): Promise<Post | null> {
    const postRecord = await prisma.post.findUnique({ where: { id } });
    if (!postRecord) return null;
    return Post.fromJSON(postRecord);
  }

  async findAll(): Promise<Post[]> {
    const postRecords = await prisma.post.findMany({
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            createdAt: true,
          },
        },
    },});
    return postRecords.map((record) => Post.fromJSON(record));
  }

  async save(post: Post): Promise<void> {
    const postData = {
      id: post.id,
      title: post.title,
      content: post.content,
      authorId: post.authorId,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    };

    if (post.id) {
      // Update existing post
      await prisma.post.update({
        where: { id: post.id },
        data: postData, 
        });
    } else {
      // Create new post
      await prisma.post.create({
        data: postData,
      });
    }
  }

  async delete(id: number): Promise<void> {
    await prisma.post.delete({ where: { id } });
    }
}