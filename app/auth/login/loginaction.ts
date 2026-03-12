  "use server";

import {LoginUseCase, LoginDTO} from "@/Application/use-case/login-use-case";
import {PrismaUserRepository} from "@/infrastructure/database/prisma-user-repository";
import {performCredentialsSign} from "@/infrastructure/auth/next-auth.adapter";

export type LoginState = {
    success?: boolean
    errors?: {
        email?: string[]
        password?: string[]
        general?: string
    }
}

export async function loginAction(
    prevState: LoginState,
    formData: FormData
): Promise<LoginState> {

    console.log("LOGIN ACTION STARTED")
    try {
        const data: LoginDTO = {
            email: formData.get("email")?.toString() || "",
            password: formData.get("password")?.toString() || "",
        }

        if (!data.email || !data.password) {
            return {
                errors: {general: "Email and password are required"}
            }
        }
    
        const repo = new PrismaUserRepository()
        const useCase = new LoginUseCase(repo)
        const result = await useCase.excute(data)

        if (!result.success) {
            return {errors: {general: result.error}}
        }

        await performCredentialsSign(result as any)
        
        return {success: true}
    } catch (err) {
        console.error("Error in loginAction:", err)
        return {errors: {general: "An unexpected error occurred"}}
    }
}
      
 