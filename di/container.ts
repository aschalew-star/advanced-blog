// ... existing imports ...

import { PrismaUserRepository } from '@/domains/user/infrastructure/repositories/prisma-user.repository';
import { RegisterUserUseCase } from '@/domains/user/application/use-cases/register-user.use-case';

// ...

export const container = {
  // User domain
  userRepository: new PrismaUserRepository(),

  registerUserUseCase: () =>
    new RegisterUserUseCase(container.userRepository),

  // ... other registrations
} as const;