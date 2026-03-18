  "use server";

import {Post} from "../../domain/entities/post";
import {PostRepository} from "@/Application/ports/post.repository.port";
import {PrismaPostRepository} from "@/infrastructure/database/prisma-post-repository";
import { GetAllPostsUseCase } from "@/Application/use-case/get-all-posts";
import { z } from "zod";


export type PostState = {
  posts?: Post[];
  error?: string;
}

export async function loadPostsAction(
  prevState: PostState
): Promise<PostState> {
  const  PostRepository = new PrismaPostRepository();
    const getAllPostsUseCase = new GetAllPostsUseCase(PostRepository);
    try {
      const result = await getAllPostsUseCase.execute();
      return {
        posts: result.posts
          ? result.posts.map((post: any) =>
              new Post({
                id: post.id,
                title: post.title,
                content: post.content,
                createdAt: post.createdAt,
                updatedAt: post.updatedAt ?? new Date(),
                authorId: post.authorId ?? 0,
                author: post.author
                  ? {
                      id: post.author.id ?? 0,
                        name: post.author.name ?? null,
                        email: post.author.email ?? null,
                        image: post.author.image ?? null,
                        createdAt: post.author.createdAt
                          ? new Date(post.author.createdAt)
                          : new Date(),
                  }
                  : undefined,
              })
            )
          : [],
      };
    } catch (error) {
      console.error("Error loading posts:", error);
      return { error: "Failed to load posts" };
    }
}