// app/(app)/posts/[slug]/LikeButton.tsx
'use client';

import { trpc } from '@/lib/trpc/trpc.client';

export function LikeButton({ postId, initialLiked }: { postId: string; initialLiked: boolean }) {
  const utils = trpc.useUtils();
  const { mutate, isPending } = trpc.post.toggleLike.useMutation({
    onMutate: async (input) => {
      // Optimistic update
      await utils.post.getPostBySlug.cancel(); // if you have query
      // ... update local cache optimistically
    },
    onSuccess: () => {
      // invalidate or update cache
      utils.post.getPostBySlug.invalidate();
    },
  });

  return (
    <button
      onClick={() => mutate({ postId })}
      disabled={isPending}
    >
      {initialLiked ? 'Unlike' : 'Like'}
    </button>
  );
}