import { User } from "../../domain/entities/user";

interface UserRepository {
  findByEmail(email: string): Promise<User | null>;
  save(user: User): Promise<void>;
}

export type { UserRepository };
