import { Post } from "@/domain/entities/post";
import { PostRepository } from "@/Application/ports/post.repository.port";

export interface Postdto {
  title: string;
  content: string;
  authorId: number;
}

export interface PostResponse {
  success: boolean;
  post?: Post;
  error?: string;
}


export class PostUseCase {
  constructor(private postRepository: PostRepository) {}

  async createPost(postData: Postdto): Promise<PostResponse> {
    const newPost = new Post({
    //   id: 0, // ID will be set by the database           
      title: postData.title,
      content: postData.content,
      authorId: postData.authorId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    await this.postRepository.save(newPost);
    return { success: true, post: newPost };
  }
}