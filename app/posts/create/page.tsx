// app/(app)/posts/create/page.tsx
'use client';

import { trpc } from '@/lib/trpc/trpc.client';
import { useRouter } from 'next/navigation';
// import { NovelEditor } from '@/components/editor/NovelEditor'; // your wrapper

export default function CreatePostPage() {
  const router = useRouter();
  const createMutation = trpc.post.create.useMutation({
    onSuccess: (data) => {
      router.push(`/posts/${data.slug}`);
    },
  });

  const handleSubmit = (title: string, content: any) => {
    createMutation.mutate({
      title,
      content,
      // authorId auto from session
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl mb-6">Create New Post</h1>
      
      {/* Title input + Novel editor */}
      {/* ... form logic to collect title + call handleSubmit on publish */}
      
      {createMutation.isPending && <p>Saving...</p>}
      {createMutation.error && <p className="text-red-500">{createMutation.error.message}</p>}
    </div>
  );
}

// Example: src/components/editor/NovelEditor.tsx (simplified)
'use client';

import { Editor } from 'novel';
import { generateUploadButton } from '@uploadthing/react';
import { useState } from 'react';

const UploadButton = generateUploadButton<OurFileRouter>();

function NovelEditor({ onChange }: { onChange: (json: any) => void }) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const handleImageUpload = async (file: File) => {
    // Use UploadThing uploader
    const uploaded = await uploadFiles({
      files: [file],
      endpoint: 'imageUploader',
    });
    return uploaded[0]?.url ?? '';
  };

  return (
    <Editor
      // ... other props
      onUpdate={({ editor }) => onChange(editor.getJSON())}
      extensions={[
        // TipTap Image extension with custom upload
        Image.configure({
          inline: true,
          allowBase64: false,
          uploadFn: handleImageUpload, // or your wrapper
        }),
      ]}
    />
  );
}