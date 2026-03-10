// src/domains/user/application/use-cases/register-user.use-case.ts

import bcrypt from 'bcryptjs';
import { User } from '@/domains/user/domain/entities/user';
import { UserRepository } from '@/domains/user/application/ports/user-repository.port';

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

export type RegisterResult =
  | { success: true; userId: number }
  | { success: false; error: string };

export class RegisterUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(input: RegisterInput): Promise<RegisterResult> {
    // 1. Validate input (basic – in real app use zod or similar)
    if (!input.name || input.name.trim().length < 2) {
      return { success: false, error: 'Name must be at least 2 characters' };
    }
    if (!input.email || !input.email.includes('@')) {
      return { success: false, error: 'Invalid email format' };
    }
    if (!input.password || input.password.length < 8) {
      return { success: false, error: 'Password must be at least 8 characters' };
    }

    // 2. Check if email already exists
    const existing = await this.userRepository.findByEmail(input.email.trim().toLowerCase());
    if (existing) {
      return { success: false, error: 'Email is already in use' };
    }

    // 3. Hash password (domain logic could be in entity, but here for simplicity)
    const hashedPassword = await bcrypt.hash(input.password, 10);

    // 4. Create entity
    const newUser = new User({
      name: input.name.trim(),
      email: input.email.trim().toLowerCase(),
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // 5. Save
    try {
      const savedUser = await this.userRepository.save(newUser);
      return { success: true, userId: savedUser.id! };
    } catch (err) {
      console.error('Registration failed:', err);
      return { success: false, error: 'Failed to create user. Please try again.' };
    }
  }
}