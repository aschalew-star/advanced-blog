import { z } from 'zod';
import { DomainError } from '../errors/domain.error';

// Minimal schema — extend as needed for your Novel usage
const TipTapNode = z.object({
  type: z.string(),
  content: z.array(z.any()).optional(),
  attrs: z.record(z.any()).optional(),
  // ... marks, text, etc.
});

const TipTapDocument = z.object({
  type: z.literal('doc'),
  content: z.array(TipTapNode),
});

export type RichTextJson = z.infer<typeof TipTapDocument>;

export class RichTextVO {
  private constructor(public readonly json: RichTextJson) {}

  static create(input: unknown): RichTextVO {
    const parsed = TipTapDocument.safeParse(input);

    if (!parsed.success) {
      throw new DomainError(`Invalid rich text content: ${parsed.error.message}`);
    }

    // Optional: enforce business rules (min length, no scripts, etc.)
    const textLength = JSON.stringify(parsed.data).length;
    if (textLength < 10) {
      throw new DomainError('Content is too short');
    }

    return new RichTextVO(parsed.data);
  }

  static fromPersistence(json: unknown): RichTextVO {
    return new RichTextVO(json as RichTextJson);
  }

  getPlainTextPreview(maxLength = 150): string {
    // Simple extraction — improve with TipTap helpers if needed
    let text = '';
    const walk = (node: any) => {
      if (node.type === 'text' && node.text) text += node.text + ' ';
      if (node.content) node.content.forEach(walk);
    };
    this.json.content?.forEach(walk);
    return text.trim().slice(0, maxLength) + (text.length > maxLength ? '...' : '');
  }

  equals(other: RichTextVO): boolean {
    return JSON.stringify(this.json) === JSON.stringify(other.json);
  }
}