import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { PrismaService } from 'src/prisma.service';
import { PaginatedCourseDto } from './dto/paginated-course.dto';
import { CalculateReviews } from './calculateReviews.service';

@Injectable()
export class CourseService {
  constructor(
    private prisma: PrismaService,
    private calculateReviews: CalculateReviews,
  ) {}

  async createCourse(data: CreateCourseDto) {
    // 1. Check user role
    const user = await this.prisma.user.findUnique({
      where: { user_id: data.instructorId },
      include: { enrollments: true, reviews: true },
    });

    if (!user) {
      throw new NotFoundException('Instructor not found');
    }
    if (user.role !== 'INSTRUCTOR') {
      throw new UnauthorizedException('Students can`t create courses');
    }

    // 2. create the course
    const result = await this.prisma.course.create({
      data: {
        title: data.title,
        description: data.description,
        price: data.price,
        instructor: { connect: { user_id: data.instructorId } },
        isReady: data.isReady
      },
    });

    return result;
  }

  async findAll(query: PaginatedCourseDto) {
    // searching query
    const where = {
      isReady: true,
      ...(query.search && {
        OR: [
          { title: { contains: query.search, lte: 'insensitive' } },
          { description: { contains: query.search, lte: 'insensitive' } },
        ],
      }),
    };
    const total = await this.prisma.course.count({ where });

    const topRated = await this.prisma.review.groupBy({
      by: ['courseId'],
      _avg: { rating: true },
      orderBy: [{ _avg: { rating: 'desc' } }, { courseId: 'asc' }],
      skip: (query.page - 1) * query.limit,
      take: query.limit,
    });

    const courseIds = topRated.map((r) => r.courseId);

    const courses = await this.prisma.course.findMany({
      where: { course_id: { in: courseIds }, isReady: true },
      include: { reviews: true },
    });

    const sorted = courseIds.map((id, idx) => {
      const course = courses.find((c) => c.course_id === id);
      return {
        ...course,
        averageRating: topRated[idx]._avg.rating ?? 0,
      };
    });


    return {
      totalItems: total,
      currentPage: query.page,
      pageSize: query.limit,
      totalPages: Math.ceil(total / query.limit),
      data: sorted,
    };
  }

  async findByStudentId(student_id: string) {
    const courses = await this.prisma.course.findMany({
      where: { enrollments: { some: { userId: student_id } }, isReady: true },
    });
    return courses;
  }

  async findOne(id: string, isAdmin: boolean) {
    const course = await this.prisma.course.findFirst({
      where: { course_id: id, ...(isAdmin ? {} : { isReady: true }) },
      include: { enrollments: true, reviews: true, sections: true },
    });
    if (!course) throw new NotFoundException('course not found');
    return course;
  }

  async updateCourse(id: string, data: UpdateCourseDto) {
    const course = await this.prisma.course.findUnique({
      where: { course_id: id },
      include: { enrollments: true, reviews: true },
    });

    if (!course) throw new NotFoundException('course not found');

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
    if (!course) throw new NotFoundException('course not found');
    await this.prisma.course.delete({ where: { course_id: id } });
    return course;
  }
}
