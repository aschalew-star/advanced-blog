'use server';
import {z} from "zod";
import {redirect} from "next/navigation";
import {cookies} from "next/headers";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";



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

async function createUser(data:{name: string, email: string, password: string}) {
  const {name,email,password}=data;

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new Error('Email is already registered');
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user in DB
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  return user;
}

export async function registerAction(prevState: RegisterState, formData: FormData): Promise<RegisterState> {
  try {
    const data = {
      name:formData.get("name")?.toString() || "",
      email:formData.get("email")?.toString() || "",
      password:formData.get("password")?.toString() || "",
      redirectTo:formData.get("redirectTo")?.toString() || "/dashboard",
    };
    
    // Validate input
      const parsed = registerSchema.safeParse(data);
      if (!parsed.success){
        const fieldErrors = parsed.error.flatten().fieldErrors;

        return {
          success:false,
          errors:{
            name:fieldErrors.name?.[0],
            email:fieldErrors.email?.[0],
            password:fieldErrors.password?.[0],
          },
        };
      }

    // Create user
    const user = await createUser(data);
    
    // Set cookie (example, adjust as needed for your auth strategy)
    (await
      // Set cookie (example, adjust as needed for your auth strategy)
      cookies()).set("session", "fake-jwt-token-for-user-"+user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    });
    
    // Redirect to dashboard or specified URL
    redirect(data.redirectTo);
  } catch (error: any) {
    return {
      success: false,
      errors: {
        general: error.message || "An unexpected error occurred",
      },
    };
  }
}