import { Injectable } from '@nestjs/common';
import { PrismaClient } from 'generated/prisma';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

const prisma = new PrismaClient();

@Injectable()
export class UserService {
  async createUser(data: CreateUserDto) {
    // try {
    if (!data.password || typeof data.password !== 'string') {
      throw new Error('Password is required and must be a string');
    }
    const user = await prisma.user.create({ data });
    return user;
  }
  async findAll() {
    const users = await prisma.user.findMany({
      include: { enrollments: true, reviews: true },
    });
    return users;
  }
  async findOneById(id: string) {
    const user = await prisma.user.findUnique({
      where: { user_id: id },
      include: { enrollments: true, reviews: true },
    });
    return user;
  }
  async findOneByEmail(email: string) {
    const user = await prisma.user.findFirst({
      where: { email: email },
      include: { enrollments: true, reviews: true },
    });
    return user;
  }

  async updateUser(id: string, data: UpdateUserDto) {
    // 1. checking user first
    const user = await prisma.user.findUnique({ where: { user_id: id } });
    if (!user) throw new Error('user not found');
    const updatedUser = await prisma.user.update({
      where: { user_id: id },
      data: data,
    });
    return updatedUser;
  }
  async deleteUser(id: any) {
    const user = await prisma.user.findUnique({
      where: { user_id: id },
      include: { enrollments: true, reviews: true },
    });
    if (!user) throw new Error('user not found');
    await prisma.user.delete({ where: { user_id: id } });
    return 'Deleted Successfuly';
  }
}
