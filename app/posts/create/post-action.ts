 "use server"

import { Post } from "@/domain/entities/post";
import { PostRepository } from "@/Application/ports/post.repository.port";
import { PrismaPostRepository } from "@/infrastructure/database/prisma-post-repository";
import { PostUseCase } from "@/Application/use-case/post-use-case";

export async function createPostAction(formData: FormData) {
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const authorId = Number(formData.get("authorId"));

  const postRepository = new PrismaPostRepository();
  const postUseCase = new PostUseCase(postRepository);

  await postUseCase.createPost({ title, content, authorId });
}
