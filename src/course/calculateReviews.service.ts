import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class CalculateReviews {
  constructor(private prisma: PrismaService) {}

  async findMostReviewedCourses(page: number, limit: number) {
    return await this.prisma.review.groupBy({
      by: ['courseId'],
      _avg: { rating: true },
      orderBy: [{ _avg: { rating: 'desc' } }, { courseId: 'asc' }],
      skip: page - 1,
      take: limit,
    });
  }
}
