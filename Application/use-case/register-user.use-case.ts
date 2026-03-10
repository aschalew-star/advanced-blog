import {prisma-user-repository} from "@/Infrastructure/prisma/repositories/prisma-user.repository";
import { UserRepository } from "../ports/user-repository.port";
import {User} from "@/domain/entities/user";
import bcrypt from "bcryptjs";                  
                  
interface RegisterUserDTO {
  name: string;
  email: string;
  password: string;
}

interface RegisterUserResult {
  success: boolean;
  error?: string;
}

export class RegisterUserUseCase {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async execute(data: RegisterUserDTO): Promise<RegisterUserResult> {
    try {
      // Check if user already exists
      const existingUser = await this.userRepository.findByEmail(data.email);
      if (existingUser) {
        return { success: false, error: 'Email is already registered' };
      }
      
      // Hash password
      const hashedPassword = await bcrypt.hash(data.password, 10);

      // Create user entity
      const newUser = new User({
        name: data.name,
        email: data.email,
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      
      // Save user to repository
      await this.userRepository.save(newUser);
      return { success: true };
    } catch (err) {
      console.error("Error in RegisterUserUseCase:", err);
      return { success: false, error: 'An unexpected error occurred' };
    }
  }
}