
"use server";

import { SignUpUseCase } from "@/application/auth/use-cases/SignUpUseCase";
import { PrismaUserRepository } from "@/infrastructure/persistence/prisma/PrismaUserRepository";
import { BcryptHashService } from "@/infrastructure/hashing/BcryptHashService";
import { signIn } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

const useCase = new SignUpUseCase(
  new PrismaUserRepository(),
  new BcryptHashService()
);

export async function signUpAction(formData: FormData) {
  const input = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const result = await useCase.execute(input);

  if (!result.success) {
    return { error: result.error }; // or throw new Error(...)
  }

  // Auto sign-in (framework concern → stays in outer layer)
  await signIn("credentials", {
    email: input.email,
    password: input.password,
    redirect: false,
  });

  redirect("/dashboard");
}