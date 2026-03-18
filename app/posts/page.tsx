  "use client";

import { Button } from "@/presentation/components/ui/button";
import { Card,
    CardTitle,
    CardContent,
    CardHeader,
    CardDescription,
    CardAction
 } from "@/presentation/components/ui/card";
 import Link from "next/link";
import { JSX } from "react";
import { loadPostsAction, PostState } from "./postsaction"; 
import { useState ,useEffect} from "react";
import  CreatePost from "./createPost";

export default  function page(): Promise<JSX.Element> {


     const [showCreatePost, setShowCreatePost] = useState(false);
     const [postsState, setPostsState] = useState<PostState>({});
     const posts = postsState.posts || [];
     const error = postsState.error;

     useEffect(() => {  
        loadPostsAction(postsState).then((newState) => {
            setPostsState(newState);
        }).catch((err) => {
            console.error("Error loading posts:", err);
            setPostsState({ error: "Failed to load posts" });
            error && console.error("Error loading posts:", error);
        }
        );

    }, []);

    return (
        <div className="flex flex-row items-center justify-between" >
          
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">All Posts</h1>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <div className="grid gap-4">
                {posts.map((post) => (
                    <Card key={post.id} className="border">
                        <CardHeader>
                            <CardTitle>{post.title}</CardTitle>
                            <CardDescription>
                                By {post.author?.name || "Unknown Author"} on{" "}
                                {new Date(post.createdAt).toLocaleDateString()}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {post.content.length > 100
                                ? post.content.substring(0, 100) + "..."
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
          <div className="text-2xl font-medium text-blue-600">
                <Button onClick={() => setShowCreatePost(true)} variant="outline"className="rounded-full px-6 py-6 text-base font-semibold shadow-lg hover:scale-105 transition-transform" >
                    create a new post
                </Button>
                {showCreatePost && (
                    <div className="mt-4 max-h-[h-screen] overflow-auto mx-auto my-auto bg-amber-50 ">
                    <CreatePost setOpen={setShowCreatePost} open={showCreatePost} />
                    </div>
                )}
            </div>
        </div>
    );
}


    