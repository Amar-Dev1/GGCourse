import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ReviewService {
  constructor(private prisma: PrismaService) {}

  // student user
  async review(data: CreateReviewDto) {
    try {
      const course = await this.prisma.course.findUnique({
        where: { course_id: data.courseId },
        include: {
          enrollments: {
            where: {
              userId: data.userId,
              completed: true,
            },
          },
        },
      });

      if (!course || course?.enrollments.length === 0)
        throw new HttpException(
          'You MUST complete the course first, So you can make a review',
          HttpStatus.FORBIDDEN,
        );

      const existingReview = await this.prisma.review.findFirst({
        where: {
          courseId: data.courseId,
          userId: data.userId,
        },
      });

      if (existingReview)
        throw new HttpException(
          'You already reviewed this course ',
          HttpStatus.CONFLICT,
        );

      const review = await this.prisma.review.create({ data: {
        userId:data.userId,
        courseId:data.courseId,
        
      } });
      return review;
    } catch (err) {
      console.log(err);

      throw err;
    }
  }

  // instructor user
  async findAllByCourseId(course_id: string) {
    const reviews = await this.prisma.review.findMany({
      where: { courseId: course_id },
    });
    return reviews;
  }

  async findAllByStudentId(student_id: string) {
    const review = await this.prisma.review.findMany({
      where: {
        userId: student_id,
      },
    });
    return review;
  }

  // non-instructor user
  async findOneById(id: string) {
    const review = await this.prisma.review.findUnique({
      where: { review_id: id },
    });
    if (!review)
      throw new HttpException('review not found', HttpStatus.NOT_FOUND);
    return review;
  }

  // non-instructor user
  async delete(id: string) {
    const review = await this.prisma.review.findUnique({
      where: { review_id: id },
    });
    if (!review)
      throw new HttpException('review not found', HttpStatus.NOT_FOUND);
    const deleted_review = await this.prisma.review.delete({
      where: { review_id: id },
    });
    return deleted_review;
  }
}
