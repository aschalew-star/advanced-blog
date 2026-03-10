 "use server"
 import { signIn } from "next-auth/react"
import { LoginDTO,LoginResult } from "@/Application/use-case/login-use-case"
 
export async function performCredentialsSign(result: LoginResult & {success:true}) {
    
    // Use NextAuth's signIn to create a session
    const signInResult = await signIn("credentials", {
        email: result.user!.email,
        password: result.user!.password, // Note: In a real app, you wouldn't pass the password like this. This is just for demonstration.
        redirect: false, // We will handle redirection manually
        callbackUrl: "/dashboard", // Redirect to dashboard after successful login
    })

    if (signInResult?.error) {
        console.error("Error during signIn:", signInResult.error)
        throw new Error("Failed to sign in")
    }
     
    return signInResult
}