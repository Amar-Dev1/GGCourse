import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { PrismaClient } from 'generated/prisma';

const prisma = new PrismaClient();

@Injectable()
export class ReviewService {
  async create(data: CreateReviewDto) {
    // const user = await prisma.user.findUnique({
    //   where: { user_id: data.userId },
    //   include: { enrollments: true },
    // });

    const course = await prisma.course.findUnique({
      where: { course_id: data.courseId },
      include: { enrollments: true },
    });

    if(!course?.enrollments[0].completed) throw new HttpException("You MUST complete the course first, so you can make a review", HttpStatus.FORBIDDEN);

    const review = await prisma.review.create({ data: data });
    return review;
  }

  async findAll() {
    const reviews = await prisma.review.findMany();
    return reviews;
  }

  async findOne(id: string) {
    const review = await prisma.review.findUnique({ where: { review_id: id } });
    if (!review)
      throw new HttpException('review not found', HttpStatus.NOT_FOUND);
    return review;
  }

  async delete(id: string) {
    const review = await prisma.review.findUnique({ where: { review_id: id } });
    if (!review)
      throw new HttpException('review not found', HttpStatus.NOT_FOUND);
    const deleted_review = await prisma.review.delete({
      where: { review_id: id },
    });
    return deleted_review;
  }
}
