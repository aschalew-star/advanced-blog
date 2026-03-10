"use client";

import { useActionState } from "react";
import { useEffect } from "react";
import { toast } from "sonner";
import { registerAction, type RegisterState } from "./actions";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/presentation/components/ui/button";
import { Input } from "@/presentation/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/presentation/components/ui/card";
import { Label } from "@/presentation/components/ui/label";
import { Loader2 } from "lucide-react";
import Link from "next/link";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type FormValues = z.infer<typeof formSchema>;

export default function SignUpPage() {

  // Server action state
  const [state, formAction,pending] = useActionState<RegisterState, FormData>(registerAction, {
    errors: {},
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  // Show general/server errors via toast
  useEffect(() => {
    if (state?.errors?.general) {
      toast.error(state.errors.general);
    }
    // Optional: show field-specific server errors too
    if (state?.errors?.email) {
      toast.error(`Email: ${state.errors.email}`);
    }
  }, [state]);

  // Optional: reset form on successful registration
  useEffect(() => {
    if (state?.success) {
      toast.success("Account created! Redirecting...");
      reset();
      // Next.js will handle redirect via server action if you return redirect()
    }
  }, [state?.success, reset]);


  

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Create Account</CardTitle>
        </CardHeader>

        <CardContent>
          <form action={formAction} className="space-y-5">
            {/* Hidden field for redirect */}
            {/* <input type="hidden" name="redirectTo" value={callbackUrl} /> */}

            {/* Name */}
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                {...register("name")}
                disabled={pending}
                placeholder="John Doe"
              />
              {errors.name && (
                <p className="text-sm text-destructive mt-1">{errors.name.message}</p>
              )}
              {state?.errors?.name && (
                <p className="text-sm text-destructive mt-1">{state.errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                disabled={pending}
                placeholder="you@example.com"
              />
              {errors.email && (
                <p className="text-sm text-destructive mt-1">{errors.email.message}</p>
              )}
              {state?.errors?.email && (
                <p className="text-sm text-destructive mt-1">{state.errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                {...register("password")}
                disabled={pending}
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="text-sm text-destructive mt-1">{errors.password.message}</p>
              )}
              {state?.errors?.password && (
                <p className="text-sm text-destructive mt-1">{state.errors.password}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={pending}>
              {pending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Sign Up"
              )}
            </Button>
          </form>

          <div className="text-center mt-6 text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/signin" className="text-primary hover:underline font-medium">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}