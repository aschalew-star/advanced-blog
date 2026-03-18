import { PostRepository } from "../ports/post.repository.port";


export interface GetAllPostsUseResponse {
  posts: Array<{
    id: number;
    title: string;
    content: string;
    createdAt: Date;
    author: {
      name: string | null; 
      image: string | null;
      email: string | null;
      createdAt: Date;
    };
  }>;
}



export class GetAllPostsUseCase {
  constructor(private postRepository: PostRepository) {}

  async execute(): Promise<GetAllPostsUseResponse> {
    const posts = await this.postRepository.findAll();

    return { posts };
  }
}

