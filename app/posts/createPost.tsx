// app/posts/create-post-modal.tsx   ← or wherever you place it
"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useActionState } from "react" // or useFormState if older React
import { createPostAction } from "./post-action" // your server action

import { Button } from "@/presentation/components/ui/button"
import { Input } from "@/presentation/components/ui/input"
import { Textarea } from "@/presentation/components/ui/textarea"
import { Label } from "@/presentation/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/presentation/components/ui/dialog"
import { Loader2, Send, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
// import { useToast } from "@/presentation/components/ui/use-toast"

// ── Schema & Types ────────────────────────────────────────
const postSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title too long"),
  content: z.string().min(1, "Content is required").max(5000, "Too long"),
  authorId: z.number().int().positive(),
})

type FormValues = z.infer<typeof postSchema>

type PostResponse =
  | { success: true; post: { id: number; title: string; slug: string } }
  | { success: false; error: string }

// ── Main Component ─────────────────────────────────────────PostResponse
export default function createPost({setOpen, open}: { setOpen: React.Dispatch<React.SetStateAction<boolean>> ,open: boolean}) {
  // const { toast } = useToast()

  const [state, formAction, isPending] = useActionState<PostResponse, FormData>(
    createPostAction,
    { success: false, error: "Something went wrong" }
  )

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: "",
      content: "",
      authorId: 1, // ← in real app: get from session/auth
    },
  })

  const contentValue = watch("content") || ""
  const charCount = contentValue.length
  const maxChars = 280 // tweet-like feel (or change to 5000)

  // Handle success/error from server action
  // (runs after action completes)
  if (state.success && open) {
    // toast({
    //   title: "Post created!",
    //   description: `Your post "${state.post?.title}" is live.`,
    // })
    reset()
    setOpen(false)
  }

  if (!state.success && state.error && open && !isPending) {
    // toast({
    //   variant: "destructive",
    //   title: "Failed to create post",
    //   description: state.error,
    // })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[580px] p-0 overflow-hidden border-none shadow-2xl">
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              <DialogHeader className="px-6 pt-6 pb-4 border-b bg-gradient-to-r from-slate-900 to-slate-800 text-white">
                <div className="flex items-center justify-between">
                  <DialogTitle className="text-2xl font-bold tracking-tight">
                    Compose Post
                  </DialogTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/10"
                    onClick={() => setOpen(false)}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                <DialogDescription className="text-slate-300 mt-1">
                  Share your thoughts with the world.
                </DialogDescription>
              </DialogHeader>

              <form
                action={formAction}
                onSubmit={handleSubmit((data) => {
                  // We still use handleSubmit for client validation
                  // But submit via formAction (server action)
                  const formData = new FormData()
                  formData.append("title", data.title)
                  formData.append("content", data.content)
                  formData.append("authorId", data.authorId.toString())
                  // submit via action (not needed manually — formAction does it)
                })}
                className="px-6 py-6 space-y-6 bg-gradient-to-b from-white to-slate-50 dark:from-slate-950 dark:to-slate-900"
              >
                {/* Hidden authorId */}
                <input type="hidden" {...register("authorId")} value="1" />

                <div className="space-y-2">
                  <Label htmlFor="title" className="text-base font-medium">
                    Title
                  </Label>
                  <Input
                    id="title"
                    placeholder="A catchy title..."
                    className="text-lg transition-all focus:ring-2 focus:ring-blue-500"
                    {...register("title")}
                  />
                  {errors.title && (
                    <p className="text-red-500 text-sm mt-1.5">
                      {errors.title.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2 relative">
                  <Label htmlFor="content" className="text-base font-medium">
                    Content
                  </Label>
                  <Textarea
                    id="content"
                    placeholder="Write something inspiring..."
                    className="min-h-[180px] text-base resize-none focus:ring-2 focus:ring-blue-500 transition-all"
                    {...register("content")}
                  />
                  <div
                    className={`absolute bottom-3 right-3 text-sm font-medium ${
                      charCount > maxChars ? "text-red-500" : "text-slate-500"
                    }`}
                  >
                    {charCount}/{maxChars}
                  </div>
                  {errors.content && (
                    <p className="text-red-500 text-sm mt-1.5">
                      {errors.content.message}
                    </p>
                  )}
                </div>

                <DialogFooter className="pt-4 border-t">
                  <Button
                    type="submit"
                    disabled={isPending || charCount > maxChars}
                    className="rounded-full px-8 py-6 text-base font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Posting...
                      </>
                    ) : (
                      <>
                        <Send className="h-5 w-5" />
                        Post Now
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  )
}