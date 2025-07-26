import { Injectable } from '@nestjs/common';
import { PrismaClient } from 'generated/prisma';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

const prisma = new PrismaClient();

@Injectable()
export class UserService {
  async createUser(data: CreateUserDto) {
    try {
      if (!data.password || typeof data.password !== 'string') {
        throw new Error('Password is required and must be a string');
      }
      const user = await prisma.user.create({ data });
      return user;
    } catch (err) {
      if(err.code === 'P2002'){
        throw new Error("Username or email already exists");
      }
      throw new Error(err?.message || 'Unknown error');
    }
  }
  async findAll() {
    try {
      const users = await prisma.user.findMany();
      return users;
    } catch (err) {
      throw new Error(err?.message || 'unKnown error');
    }
  }
  async findOneById(id: string) {
    try {
      const user = await prisma.user.findUnique({ where: { user_id:id } });
      return user;
    } catch (err) {
      throw new Error(err?.message || 'unKnown error');
    }
  }
  async findOneByEmail(email: string) {
    try {
      const user = await prisma.user.findFirst({ where: { email:email } });
      return user;
    } catch (err) {
      throw new Error(err?.message || 'unKnown error');
    }
  }

  async updateUser(id: string, data: UpdateUserDto) {
    try {
      // 1. checking user first
      const user = await prisma.user.findUnique({ where: { user_id: id } });
      if (!user) throw new Error('user not found');
      const updatedUser = await prisma.user.update({
        where: { user_id: id },
        data: data,
      });
      return updatedUser;
    } catch (err) {
      throw new Error(err?.message || 'unKnown error');
    }
  }
  async deleteUser(id: any) {
    try {
      const user = await prisma.user.findUnique({ where: { user_id: id } });
      if (!user) throw new Error('user not found');
      await prisma.user.delete({ where: { user_id: id } });
      return 'Deleted Successfuly';
    } catch (err) {
      throw new Error(err?.message || 'Unknown error');
    }
  }
}
