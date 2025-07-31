import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async createUser(data: CreateUserDto) {
    if (!data.password || typeof data.password !== 'string') {
      throw new HttpException(
        'Password is required and must be a string',
        HttpStatus.BAD_REQUEST,
      );
    }
    const user = await this.prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        username: data.username,
        role: data.role,
        password: data.password,
      },
    });
    return user;
  }
  async findAll() {
    const users = await this.prisma.user.findMany({
      omit: {
        password: true,
        created_at: true,
        updated_at: true,
      },
    });

    return users;
  }
  async findOneById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { user_id: id },
    });
    if (!user) throw new HttpException('user not found', HttpStatus.NOT_FOUND);

    const result = await this.prisma.user.findUnique({
      where: { user_id: id },
      select: {
        user_id:true,
        name: true,
        email: true,
        username: true,
        role: true,
        courses: user?.role === 'INSTRUCTOR' ? true : false,
        enrollments: user?.role === 'STUDENT' ? true : false,
        reviews: user.role === 'STUDENT' ? true : false,
      },
    });

    return result;
  }
  async findOneByEmail(email: string) {
    const user = await this.prisma.user.findFirst({
      where: { email: email },
      omit: {
        created_at: true,
        updated_at: true,
      },
    });
    if (!user) return false;
    return user;
  }

  async updateUser(id: string | any, data: UpdateUserDto) {
    // 1. checking user first
    const user = await this.prisma.user.findUnique({ where: { user_id: id } });
    if (!user) return null;
    const updatedUser = await this.prisma.user.update({
      where: { user_id: id },
      data: {
        name: data.name,
        email: data.email,
        password: data.password,
        username: data.username,
        role: data.role,
      },
    });
    const { password, ...rest } = updatedUser;
    return rest;
  }
  async deleteUser(id: any) {
    const user = await this.findOneById(id);
    if (!user) throw new HttpException('user not found', HttpStatus.NOT_FOUND);
    await this.prisma.user.delete({ where: { user_id: id } });
    return user;
  }
}
