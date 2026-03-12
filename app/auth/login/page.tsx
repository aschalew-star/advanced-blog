"use client";

import { Button } from "@/presentation/components/ui/button";
import { Input } from "@/presentation/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/presentation/components/ui/card";
import { Label } from "@/presentation/components/ui/label";
import { Separator } from "@/presentation/components/ui/separator";
import { useActionState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useEffect } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { loginAction, type LoginState } from "./loginaction";

// Infer type from schema (same as server)
const formSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

type FormValues = z.infer<typeof formSchema>;

// Assuming loginAction is defined elsewhere and returns LoginState
// e.g. { errors?: { general?: string; email?: string[]; password?: string[] }; ... }

export default function SignInPage() {
  const [state, formAction, pending] = useActionState<LoginState, FormData>(
    loginAction,
    { errors: {} }
  );

  const {
    register,
    handleSubmit,          // ← we still use this to trigger validation
    formState: { errors },
    setError,             // useful if you want to show server field errors
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", password: "" },
  });

  // Show toast on server error
  useEffect(() => {
    if (state.errors?.general) {
      toast.error(state.errors.general);
    }

    // Optional: map server field errors back to RHF (nice UX)
    if (state.errors?.email) {
      setError("email", { type: "server", message: state.errors.email.join(", ") });
    }
    if (state.errors?.password) {
      setError("password", { type: "server", message: state.errors.password.join(", ") });
    }
  }, [state.errors, setError]);

  
  console.log(state.errors?.general)

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-bold">Advanced Blog</CardTitle>
          <CardDescription>
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Credentials Form */}
          {/* Important: add action={formAction} here */}
          <form action={formAction}  className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                {...register("email")}
                disabled={pending}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="•••••••"
                {...register("password")}
                disabled={pending}
              />
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password.message}</p>
              )}
            </div>
            <Button type="submit" className="w-full" disabled={pending}>
              {pending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          {/* Google Button – using Auth.js signIn */}
        
            <Button variant="outline" className="w-full" onClick={()=>{signIn("google",{callbackUrl:"/dashboard"})}}>
              {/* ... your Google SVG ... */}
              Continue with Google
            </Button>
        </CardContent>
        <CardFooter className="flex flex-col items-center justify-center text-sm text-muted-foreground">
          <p>Don't have an account?</p>
          <Link href="/auth/signup" className="text-primary hover:underline">
            Create an account
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}