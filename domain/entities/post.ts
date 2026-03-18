import { fromJSONSchema } from "zod";
import { User } from "./user";

export interface PostProps {
  id?: number;                  // Optional for new posts (before save)
  title: string;
  content: string;
  authorId: number;             // Reference to User by ID
  createdAt: Date;
  updatedAt: Date;
  author?: {
    id: number;
    name: string | null | undefined;
    email: string | null | undefined;
    image: string | null | undefined;
    createdAt: Date;
  };
}

export class Post {
  private props: PostProps;

  constructor(props: PostProps) {
    this.props = {
      ...props,
      createdAt: props.createdAt ?? new Date(),
      updatedAt: props.updatedAt ?? new Date(),
    };

    this.validate(); // Enforce invariants
  }

  // Getters (immutable access)
  get id(): number | undefined {
    return this.props.id;
  }

  get title(): string {
    return this.props.title;
  }

  get content(): string {
    return this.props.content;
  }

  get authorId(): number {
    return this.props.authorId;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  private validate() {
    if (!this.props.title || this.props.title.trim() === '') {
      throw new Error('Post title is required');
    }
    if (!this.props.content || this.props.content.trim() === '') {
      throw new Error('Post content is required');
    }
    if (!this.props.authorId) {
      throw new Error('Post must have an authorId');
    }
  }
  
  toJSON() {  
    return {
      id: this.id,
      title: this.title,
      content: this.content,
      authorId: this.authorId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  fromJSON(json: any): Post {
    return new Post({
      id: json.id,
      title: json.title,
      content: json.content,
      authorId: json.authorId,
      createdAt: new Date(json.createdAt),
      updatedAt: new Date(json.updatedAt),
      author: json.author ? {
        id: json.author.id,
        name: json.author.name,
        email: json.author.email,
        image: json.author.image,
        createdAt: new Date(json.author.createdAt),
      } : undefined,
    });
  } 
}   