// src/domains/user/application/ports/user-repository.port.ts

import { User } from '@/domains/user/domain/entities/user';

export interface UserRepository {
  findById(id: number): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findByCredentials(email: string): Promise<User | null>; // For login (includes password)

  save(user: User): Promise<User>;          // Create or update
  update(user: User): Promise<User>;        // Partial update if needed
  delete(id: number): Promise<void>;

  // Optional: for pagination or lists
  // findMany(params: { skip?: number; take?: number; }): Promise<User[]>;
}