// application/auth/use-cases/SignUpUseCase.ts
import type { UserRepository } from "@/infrastructure/persistence/UserRepository";
import type { HashService } from "@/infrastructure/hashing/HashService";

export type SignUpInput = {
  name: string;
  email: string;
  password: string;
};

export type SignUpResult =
  | { success: true; userId: number }
  | { success: false; error: "email_taken" | "weak_password" | "unexpected" };

export class SignUpUseCase {
  constructor(
    private userRepo: UserRepository,
    private hashService: HashService
  ) {}

  async execute(input: SignUpInput): Promise<SignUpResult> {
    if (input.password.length < 8) {
      return { success: false, error: "weak_password" };
    }

    const existing = await this.userRepo.findByEmail(input.email);
    if (existing) {
      return { success: false, error: "email_taken" };
    }

    const hashed = await this.hashService.hash(input.password);

    const user = await this.userRepo.create({
      name: input.name,
      email: input.email,
      password: hashed,
    });

    return { success: true, userId: user.id };
  }
}