import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ReviewService {
  constructor(private prisma: PrismaService) {}

  // student user
  async review(data: CreateReviewDto) {
    const course = await this.prisma.course.findUnique({
      where: { course_id: data.courseId },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    const enrollment = await this.prisma.enrollment.findFirst({
      where: {
        courseId: data.courseId,
        userId: data.userId,
        completed: true,
      },
    });

    if (!enrollment) {
      throw new UnauthorizedException(
        'You MUST complete the course first, so you can make a review',
      );
    }

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

    const review = await this.prisma.review.create({
      data: {
        userId: data.userId,
        courseId: data.courseId,
        rating: data.rating,
      },
    });

    await this.updateCourseAverageScore(review.courseId);

    return review;
  }

  // student user
  private async updateCourseAverageScore(course_id: string) {
    const averatgeReviews = await this.prisma.review.aggregate({
      where: { courseId: course_id },
      _avg: { rating: true },
    });

    await this.prisma.course.update({
      where: {
        course_id: course_id,
      },
      data: {
        average_review_score: averatgeReviews._avg.rating?.toNumber() ?? 0,
      },
    });
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
