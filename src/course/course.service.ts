import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { PrismaService } from 'src/prisma.service';
import { CourseQueryDto } from './dto/course-query-.dto';

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
      throw new NotFoundException('Instructor not found');
    }
    if (user.role !== 'INSTRUCTOR') {
      throw new UnauthorizedException('Students can`t create courses');
    }

    // 2. create the course
    const course = await this.prisma.course.create({
      data: {
        title: data.title,
        description: data.description,
        price: data.price,
        instructor: { connect: { user_id: data.instructorId } },
      },
    });

    return course;
  }

  async findAll(query: CourseQueryDto) {
    try {
      const { page = 1, limit = 10, sorted_by = 'newest', search } = query;

      let take = Number(limit);
      let skip = (Number(page) - 1) * take;

      let orderBy = {};

      const where: any = {
        isReady: true,
      };

      if (search) {
        const filter = {
         contains:search,
          mode : "insensitive"
        }
        where.OR = [{ title: filter }, { description: filter }];
      }

      if (sorted_by === 'reviews') {
        where.reviews = { some: {} };
      }

      orderBy =
        sorted_by === 'reviews'
          ? { average_review_score: 'desc' }
          : { publication_date: 'desc' };

      const courses = await this.prisma.course.findMany({
        where,
        orderBy,
        take,
        skip,
      });
      const total = await this.prisma.course.count({ where });

      return {
        total,
        currentPage: page,
        pageSize: query.limit,
        data: courses,
      };
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async findByStudentId(student_id: string) {
    const courses = await this.prisma.course.findMany({
      where: { enrollments: { some: { userId: student_id } }, isReady: true },
    });
    return courses;
  }
  async findByInstructorId(instructor_id: string) {
    const courses = await this.prisma.course.findMany({
      where: {
        instructorId: instructor_id,
      },
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
      include: { enrollments: true, sections: { include: { lessons: true } } },
    });

    if (!course) throw new NotFoundException('course not found');

    const becomingPublished = !course.isReady && data.isReady === true;

    if (becomingPublished) {
      const allLessons = course.sections.flatMap((l) => l.lessons);
      if (allLessons.length === 0) {
        throw new BadRequestException(
          'Cannot publish course without any lessons',
        );
      }
    }

    const result = await this.prisma.course.update({
      where: { course_id: id },
      data: {
        ...data,
        ...(becomingPublished && { publication_date: new Date() }),
      },
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
