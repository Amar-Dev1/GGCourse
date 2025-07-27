import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { PrismaClient } from 'generated/prisma';

const prisma = new PrismaClient();

@Injectable()
export class CourseService {
  
  async createCourse(data: CreateCourseDto) {
    // 1. Check user role
    const user = await prisma.user.findUnique({
      where: { user_id: data.instructorId },
      include:{enrollments:true, reviews:true},
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
  }

  async findAll() {
    const result = await prisma.course.findMany({
      include:{enrollments:true, reviews:true},
    });
    return result;
  }

  async findOne(id: string) {
    const course = await prisma.course.findUnique({
      where: { course_id: id },
      include:{enrollments:true, reviews:true},
    });
    if (!course) throw new Error('course not found');
    return course;
  }

  async updateCourse(id: string, data: UpdateCourseDto) {
    const course = await prisma.course.findUnique({
      where: { course_id: id },
      include:{enrollments:true, reviews:true},
    });

    if (!course) throw new Error('course not found');

    const result = await prisma.course.update({
      where: { course_id: id },
      data: data,
    });
    return result;
  }

  async deleteCourse(id: string) {
    const course = await prisma.course.findUnique({
      where: { course_id: id },
      include:{enrollments:true, reviews:true},
    });
    if (!course) throw new Error('course not found');
    await prisma.course.delete({ where: { course_id: id } });
    return course;
  }
}
