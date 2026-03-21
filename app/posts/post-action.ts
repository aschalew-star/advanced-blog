// app/posts/post-action.ts
"use server";

import { PrismaPostRepository } from "@/infrastructure/database/prisma-post-repository";
import { PostUseCase } from "@/Application/use-case/post-use-case";

export type PostResponse =
  | { success: true; post: { id: number; title: string; slug: string } }
  | { success: false; error: string };

export async function createPostAction(
  prevState: PostResponse,
  formData: FormData
): Promise<PostResponse> {
  try {
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const authorId = Number(formData.get("authorId"));

    const repo = new PrismaPostRepository();
    const useCase = new PostUseCase(repo);

    const post = await useCase.createPost({
      title,
      content,
      authorId,
    });

    return {
      success: true,
      post: {
        id: post.id,
        title: post.title,
        slug: post.slug ?? "",
      },
    };
  } catch (err) {
    console.error(err);
    return {
      success: false,
      error: "Failed to create post",
    };
  }
}