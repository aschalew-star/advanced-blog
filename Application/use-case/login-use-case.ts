import { UserRepository } from "../ports/user-repository.port";
import {User } from "@/domain/entities/user";
import bcrypt from "bcryptjs";



 export interface LoginDTO {
    email: string;
    password: string;
}

 export interface LoginResult {
    success: boolean;
    user?: User;
    error?: string;
}

export class LoginUseCase {
    constructor(
        private userRepository: UserRepository
    ) {}
async excute(data: LoginDTO): Promise<LoginResult> {
    try {
        const user = await this.userRepository.findByEmail(data.email);
        if (!user) {
            return { success: false, error: 'Invalid email or password' };
        }

        if (!user.password) {
            return { success: false, error: 'Invalid email or password' };
        }

        // Here you would normally compare the hashed password
        const isValid = await bcrypt.compare(data.password, user.password);
        if (!isValid) {
            return { success: false, error: 'Invalid email or password' };
        }

        return { success: true, user };
    } catch (err) {
        console.error("Error in LoginUseCase:", err);
        return { success: false, error: 'An unexpected error occurred' };
    }
}
}
