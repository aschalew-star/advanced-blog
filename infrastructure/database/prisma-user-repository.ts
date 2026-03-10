import prisma from "@/lib/prisma";
import { User, UserProps } from "@/domain/entities/user";
import { UserRepository } from "@/Application/ports/user-repository.port";

export class PrismaUserRepository implements UserRepository {
  async findByEmail(email: string): Promise<User | null> {
    const userRecord = await prisma.user.findUnique({ where: { email } });
    if (!userRecord) return null;
    return User.fromJSON(userRecord);
  }
  async save(user: User): Promise<void> {
    const userData: UserProps = {
      id: user.id,
      name: user.name,
      email: user.email,
      emailVerified: user.emailVerified,
      image: user.image,
      password: user.password,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    if (user.id) {
      // Update existing user
      await prisma.user.update({
        where: { id: user.id },
        data: userData,
      });
    }
      else {
      // Create new user
      await prisma.user.create({
        data: userData,
      });
    } 
  }

}
