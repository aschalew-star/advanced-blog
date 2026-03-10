'use server'

import { z } from "zod"
import { redirect } from "next/navigation"
import { RegisterUserUseCase } from "@/Application/use-case/register-user.use-case"
import { PrismaUserRepository } from "@/infrastructure/database/prisma-user-repository"

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  redirectTo: z.string().optional(),
})

export type RegisterState = {
  success?: boolean
  errors?: {
    name?: string[]
    email?: string[]
    password?: string[]
    redirectTo?: string[]
    general?: string
  }
}

export async function registerAction(
  prevState: RegisterState,
  formData: FormData
): Promise<RegisterState> {

  console.log("REGISTER ACTION STARTED")

  const data = {
    name: formData.get("name")?.toString() || "",
    email: formData.get("email")?.toString() || "",
    password: formData.get("password")?.toString() || "",
    redirectTo: formData.get("redirectTo")?.toString() || "/dashboard",
  }

  const parsed = registerSchema.safeParse(data)

  if (!parsed.success) {
    return {
      errors: parsed.error.flatten().fieldErrors,
    }
  }

  const repo = new PrismaUserRepository()
  const useCase = new RegisterUserUseCase(repo)

  const result = await useCase.execute({
    name: data.name,
    email: data.email,
    password: data.password,
  })

  if (!result.success) {
    return { errors: { general: result.error } }
  }

  redirect(data.redirectTo)
}