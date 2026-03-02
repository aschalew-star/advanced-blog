// ... existing imports
import { CreatePostUseCase } from '@/application/use-cases/posts/create-post.use-case';

// In router:
  create: protectedProcedure
    .input(CreatePostInputSchema)
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.useCases.createPost.execute({
        ...input,
        authorId: ctx.session.user.id!, // enforced by protectedProcedure
      });

      if (!result.success) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: typeof result.error === 'string' ? result.error : 'Validation failed',
          data: result.error,
        });
      }

      return result; // { success: true, postId, slug }
    }),