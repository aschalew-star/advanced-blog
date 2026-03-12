import { Post } from "@/domain/entities/post";

interface PostRepository {
  findById(id: number): Promise<Post | null>;
  findAll(): Promise<Post[]>;
  save(post: Post): Promise<void>;
  delete(id: number): Promise<void>;
}

export type { PostRepository };
