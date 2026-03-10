// src/domains/user/infrastructure/repositories/prisma-user.repository.ts

import prisma from '@/infrastructure/database/prisma';
import { User } from '@/domains/user/domain/entities/user';
import { UserRepository } from '@/domains/user/application/ports/user-repository.port';

export class PrismaUserRepository implements UserRepository {
  async findById(id: number): Promise<User | null> {
    const data = await prisma.user.findUnique({
      where: { id },
    });
    return data ? User.fromJSON(data) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const data = await prisma.user.findUnique({
      where: { email },
    });
    return data ? User.fromJSON(data) : null;
  }

  // Special method for login (includes password field)
  async findByCredentials(email: string): Promise<User | null> {
    const data = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        image: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return data ? User.fromJSON(data) : null;
  }

  async save(user: User): Promise<User> {
    const data = user.toJSON();

    const created = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: data.password,
        image: data.image,
        emailVerified: data.emailVerified,
      },
    });

    return User.fromJSON(created);
  }

  async update(user: User): Promise<User> {
    const data = user.toJSON();

    const updated = await prisma.user.update({
      where: { id: data.id! },
      data: {
        name: data.name,
        email: data.email,
        image: data.image,
        emailVerified: data.emailVerified,
        // password: only update if provided (handled in use-case)
        updatedAt: new Date(),
      },
    });

    return User.fromJSON(updated);
  }

  async delete(id: number): Promise<void> {
    await prisma.user.delete({ where: { id } });
  }
}