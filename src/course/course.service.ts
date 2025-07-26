import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { PrismaClient } from 'generated/prisma';

const prisma = new PrismaClient();

@Injectable()
export class CourseService {
  async createCourse(data: CreateCourseDto) {
    try {
      // 1. Check user role
      const user = await prisma.user.findUnique({
        where: { user_id: data.instructorId },
      });
      console.log('User:', user);
      if (!user) {
        throw new HttpException('Instructor not found', HttpStatus.NOT_FOUND);
      }
      if (user.role !== 'INSTRUCTOR') {
        throw new HttpException(
          'You must switch your role to INSTRUCTOR',
          HttpStatus.FORBIDDEN,
        );
      }

      // 2. create the course
      const result = await prisma.course.create({
        data: {
          title: data.title,
          description: data.description,
          price: data.price,
          instructor: { connect: { user_id: data.instructorId } },
        },
      });

      return result;
    } catch (err) {
      if (err.code === 'P2002') {
        throw new HttpException(
          'A course with this id already exists.',
          HttpStatus.BAD_REQUEST,
        );
      }
      if (err.code === 'P2025') {
        throw new HttpException(
          'A course with this id already exists.',
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException(
        'An unexpected error occurred. Please check your input.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  async findAll() {
    try {
      const result = await prisma.course.findMany();
      return result;
    } catch (err) {
      throw new Error(err.message || 'unknown error');
    }
  }

  async findOne(id: string) {
    try {
      const course = await prisma.course.findUnique({
        where: { course_id: id },
      });
      if (!course) throw new Error('course not found');

      return course;
    } catch (err) {
      throw new Error(err.message || 'unknown error');
    }
  }

  async updateCourse(id: string, data: UpdateCourseDto) {
    try {
      const course = await prisma.course.findUnique({
        where: { course_id: id },
      });

      if (!course) throw new Error('course not found');

      const result = await prisma.course.update({
        where: { course_id: id },
        data: data,
      });
      return result;
    } catch (err) {
      if (err.code === 'P2002') {
        throw new HttpException(
          'A course with this unique field already exists.',
          HttpStatus.BAD_REQUEST,
        );
      }
      if (err.code === 'P2025') {
        throw new HttpException(
          'Related record not found.',
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException(
        'An unexpected error occurred. Please check your input.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async deleteCourse(id: string) {
    try {
      const course = await prisma.course.findUnique({
        where: { course_id: id },
      });
      if (!course) throw new Error('course not found');
      await prisma.course.delete({ where: { course_id: id } });
      return course;
    } catch (err) {
      throw new Error(err.message || 'unknown error');
    }
  }
}
