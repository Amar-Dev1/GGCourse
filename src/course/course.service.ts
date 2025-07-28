import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class CourseService {
  
constructor(private prisma:PrismaService){}

  async createCourse(data: CreateCourseDto) {
    // 1. Check user role
    const user = await this.prisma.user.findUnique({
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
    const result = await this.prisma.course.create({
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
    const result = await this.prisma.course.findMany({
      include:{enrollments:true, reviews:true},
    });
    return result;
  }

  async findOne(id: string) {
    const course = await this.prisma.course.findUnique({
      where: { course_id: id },
      include:{enrollments:true, reviews:true},
    });
    if (!course) throw new Error('course not found');
    return course;
  }

  async updateCourse(id: string, data: UpdateCourseDto) {
    const course = await this.prisma.course.findUnique({
      where: { course_id: id },
      include:{enrollments:true, reviews:true},
    });

    if (!course) throw new Error('course not found');

    const result = await this.prisma.course.update({
      where: { course_id: id },
      data: data,
    });
    return result;
  }

  async deleteCourse(id: string) {
    const course = await this.prisma.course.findUnique({
      where: { course_id: id },
      include:{enrollments:true, reviews:true},
    });
    if (!course) throw new Error('course not found');
    await this.prisma.course.delete({ where: { course_id: id } });
    return course;
  }
}
