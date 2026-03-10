// src/domains/post/domain/entities/post.ts

export interface PostProps {
  id?: number;
  slug: string;
  title: string;
  content: any;               // JSON from Prisma
  authorId: number;
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

export class Post {
  private props: PostProps;

  constructor(props: PostProps) {
    this.props = {
      ...props,
      views: props.views ?? 0,
      createdAt: props.createdAt ?? new Date(),
      updatedAt: props.updatedAt ?? new Date(),
    };

    this.validate();
  }

  get id(): number | undefined {
    return this.props.id;
  }

  get slug(): string {
    return this.props.slug;
  }

  get title(): string {
    return this.props.title;
  }

  get content(): any {
    return this.props.content;
  }

  get authorId(): number {
    return this.props.authorId;
  }

  get views(): number {
    return this.props.views;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  private validate(): void {
    if (!this.props.slug || this.props.slug.length < 3) {
      throw new Error('Slug must be at least 3 characters');
    }
    if (!this.props.title || this.props.title.trim().length === 0) {
      throw new Error('Title is required');
    }
    if (this.props.content == null) {
      throw new Error('Content cannot be null');
    }
  }

  incrementViews(): void {
    this.props.views += 1;
    this.props.updatedAt = new Date();
  }

  toJSON(): any {
    return {
      id: this.props.id,
      slug: this.props.slug,
      title: this.props.title,
      content: this.props.content,
      authorId: this.props.authorId,
      views: this.props.views,
      createdAt: this.props.createdAt,
      updatedAt: this.props.updatedAt,
    };
  }

  static fromJSON(data: any): Post {
    return new Post({
      id: data.id,
      slug: data.slug,
      title: data.title,
      content: data.content,
      authorId: data.authorId,
      views: data.views ?? 0,
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
    });
  }
}