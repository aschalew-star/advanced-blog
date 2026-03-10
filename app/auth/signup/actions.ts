 'use server';
import {z} from "zod";
import {redirect} from "next/navigation";
import { RegisterUserUseCase } from "@/Application/use-case/register-user.use-case";
import {prisma-user-repository} from "@/Infrastructure/prisma/repositories/prisma-user.repository";


const registerSchema=z.object({
  name:z.string().min(2,"Name must be at least 2 characters"),
  email:z.string().email("Please enter a valid email"),
  password:z.string().min(6,"Password must be at least 6 characters"),
  redirectTo:z.string().optional(), 
});

export type RegisterState = {
  success?: boolean;
  errors?: {
    general?: string;
    email?: string;
    password?: string;
    redirectTo?: string;
  };
};

export async function registerAction(prevState: RegisterState, formData: FormData): Promise<RegisterState> {
  try {
    const data = {
      name:formData.get("name")?.toString() || "",
      email:formData.get("email")?.toString() || "",
      password:formData.get("password")?.toString() || "",
      redirectTo:formData.get("redirectTo")?.toString() || "/dashboard",
    };
    
    // Validate input
    const parseResult = registerSchema.safeParse(data);
    if (!parseResult.success) {
      const errors = parseResult.error.flatten().fieldErrors;
      return { success: false, errors: { ...errors } };
    }

    // Use application service to handle registration logic
    const userRepository = new prisma-user-repository();
    const registerUseCase = new RegisterUserUseCase(userRepository);
    const result = await registerUseCase.execute({
      name: data.name,
      email: data.email,
      password: data.password,
    });

    if (!result.success) {
      return { success: false, errors: { general: result.error } };
    }

    return { success: true };
  } catch (err) {
    console.error("Registration error:", err);
    return { success: false, errors: { general: "An unexpected error occurred. Please try again." } };
  }
}