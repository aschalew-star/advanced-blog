// ... imports
import { SlugVO } from '../value-objects/slug';
import { RichTextVO } from '../value-objects/rich-text';
import { PostLikedDomainEvent } from '../domain-events/post-liked';

export class Post {
  private _likes: Set<string> = new Set();

  constructor(
    public readonly id: string,
    public readonly slug: SlugVO,
    public readonly title: string,
    public readonly content: RichTextVO,
    public readonly authorId: string,
    likes: string[] = [],
    public readonly createdAt: Date = new Date(),
    public updatedAt: Date = new Date(),
  ) {
    this._likes = new Set(likes);
  }

  like(userId: string): PostLikedDomainEvent | null {
    if (this._likes.has(userId)) return null;

    this._likes.add(userId);
    this.updatedAt = new Date();

    return new PostLikedDomainEvent(this.id, userId, this.authorId);
  }

  static create(props: {
    id: string;
    title: string;
    content: unknown;
    authorId: string;
  }): Post {
    const slug = SlugVO.create(props.title);
    const richContent = RichTextVO.create(props.content);

    return new Post(props.id, slug, props.title, richContent, props.authorId);
  }

  // ... more methods
}