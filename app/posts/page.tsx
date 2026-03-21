"use client";

import { useEffect, useState, JSX } from "react";
import Link from "next/link";

import { Button } from "@/presentation/components/ui/button";
import {
  Card,
  CardTitle,
  CardContent,
  CardHeader,
  CardDescription,
  CardAction,
} from "@/presentation/components/ui/card";

import CreatePost from "./createPost";
import { loadPostsAction, PostState } from "./postsaction";

export default function Page(): JSX.Element {
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [postsState, setPostsState] = useState<PostState>({
    posts: [],
    error: undefined,
  });
  const [loading, setLoading] = useState(true);

  const posts = postsState.posts || [];
  const error = postsState.error;

  // ✅ Load posts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const newState = await loadPostsAction(postsState);
        setPostsState(newState);
      } catch (err) {
        console.error("Error loading posts:", err);
        setPostsState({ posts: [], error: "Failed to load posts" });
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="flex flex-row items-start justify-between gap-6 p-4">
      {/* LEFT SIDE */}
      <div className="flex-1 container mx-auto">
        <h1 className="text-3xl font-bold mb-6">All Posts</h1>

        {/* ✅ Loading */}
        {loading && <p>Loading posts...</p>}

        {/* ✅ Error */}
        {error && <p className="text-red-500 mb-4">{error}</p>}

        {/* ✅ Posts */}
        {!loading && posts.length === 0 && (
          <div className="text-gray-500">No posts found</div>
        )}

        <div className="grid gap-4">
          {!loading &&
            posts.length > 0 &&
            posts.map((post) => (
              <Card key={post.id} className="border shadow-sm">
                <CardHeader>
                  <CardTitle>{post.title}</CardTitle>
                  <CardDescription>
                    By {post.author?.name || "Unknown Author"} on{" "}
                    {new Date(post.createdAt).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  {post.content.length > 100
                    ? post.content.slice(0, 100) + "..."
                    : post.content}
                </CardContent>

                <CardAction>
                  <Link href={`/posts/${post.id}`}>
                    <Button variant="outline">Read More</Button>
                  </Link>
                </CardAction>
              </Card>
            ))}
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="w-[300px] flex flex-col items-center gap-4">
        <Button
          onClick={() => setShowCreatePost(true)}
          variant="outline"
          className="rounded-full px-6 py-4 text-base font-semibold shadow-lg hover:scale-105 transition-transform"
        >
          Create New Post
        </Button>

        {showCreatePost && (
          <div className="w-full max-h-screen overflow-auto bg-amber-50 p-4 rounded-xl shadow">
            <CreatePost
              setOpen={setShowCreatePost}
              open={showCreatePost}
            />
          </div>
        )}
      </div>
    </div>
  );
}