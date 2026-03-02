import { z } from 'zod';
import { DomainError } from '../errors/domain.error';

export const SlugValue = z
  .string()
  .min(3, 'Slug must be at least 3 characters')
  .max(200, 'Slug cannot exceed 200 characters')
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    'Slug can only contain lowercase letters, numbers, and hyphens (no consecutive hyphens)'
  );

export type Slug = z.infer<typeof SlugValue>;

export class SlugVO {
  private constructor(public readonly value: Slug) {}

  static create(value: string): SlugVO {
    const normalized = value
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '');

    const result = SlugValue.safeParse(normalized);

    if (!result.success) {
      throw new DomainError(`Invalid slug: ${result.error.issues.map(i => i.message).join(', ')}`);
    }

    return new SlugVO(result.data);
  }

  static fromPersistence(value: string): SlugVO {
    // Less strict — assume DB already validated
    return new SlugVO(value as Slug);
  }

  equals(other: SlugVO): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}