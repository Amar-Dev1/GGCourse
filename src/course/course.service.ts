import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { PrismaService } from 'src/prisma.service';
import { PaginatedCourseDto } from './dto/paginated-course.dto';

@Injectable()
export class CourseService {
  constructor(private prisma: PrismaService) {}

  async createCourse(data: CreateCourseDto) {
    // 1. Check user role
    const user = await this.prisma.user.findUnique({
      where: { user_id: data.instructorId },
      include: { enrollments: true, reviews: true },
    });

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

  async findAll(query: PaginatedCourseDto) {
    const skip = (query.page - 1) * query.limit;

    // searching query
    const where = query.search
      ? {
          OR: [
            { title: { contains: query.search, lte: 'insensitive' } },
            { description: { contains: query.search, lte: 'insensitive' } },
          ],
        }
      : {};
    // pagination
    const [data, total] = await this.prisma.$transaction([
      this.prisma.course.findMany({
        where,
        skip: skip,
        take: query.limit,
        orderBy: { price: 'asc' },
      }),
      this.prisma.course.count({ where }),
    ]);

    return {
      totalItems: total,
      currentPage: query.page,
      pageSize: query.limit,
      totalPages: Math.ceil(total - query.limit),
      data,
    };
  }

  async findByStudentId(student_id: string) {
    const courses = await this.prisma.course.findMany({
      where: { enrollments: { some: { userId: student_id } } },
    });
    return courses;
  }

  async findOne(id: string) {
    const course = await this.prisma.course.findUnique({
      where: { course_id: id },
      include: { enrollments: true, reviews: true, sections: true },
    });
    if (!course) throw new Error('course not found');
    return course;
  }

  async updateCourse(id: string, data: UpdateCourseDto) {
    const course = await this.prisma.course.findUnique({
      where: { course_id: id },
      include: { enrollments: true, reviews: true },
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
      include: { enrollments: true, reviews: true },
    });
    if (!course)
      throw new HttpException('course not found', HttpStatus.NOT_FOUND);
    await this.prisma.course.delete({ where: { course_id: id } });
    return course;
  }
}
