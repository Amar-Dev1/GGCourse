import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ReviewService {
  constructor(private prisma: PrismaService) {}
  async create(data: CreateReviewDto) {
    const course = await this.prisma.course.findUnique({
      where: { course_id: data.courseId },
      include: { enrollments: true },
    });

    if (!course?.enrollments[0].completed)
      throw new HttpException(
        'You MUST complete the course first, so you can make a review',
        HttpStatus.FORBIDDEN,
      );

    const review = await this.prisma.review.create({ data: data });
    return review;
  }

  async findAll() {
    const reviews = await this.prisma.review.findMany();
    return reviews;
  }

  async findOne(id: string) {
    const review = await this.prisma.review.findUnique({ where: { review_id: id } });
    if (!review)
      throw new HttpException('review not found', HttpStatus.NOT_FOUND);
    return review;
  }

  async delete(id: string) {
    const review = await this.prisma.review.findUnique({ where: { review_id: id } });
    if (!review)
      throw new HttpException('review not found', HttpStatus.NOT_FOUND);
    const deleted_review = await this.prisma.review.delete({
      where: { review_id: id },
    });
    return deleted_review;
  }
}
