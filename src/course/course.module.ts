import { Module } from '@nestjs/common';
import { CourseService } from './course.service';
import { CourseController } from './course.controller';
import { CalculateReviews } from './calculateReviews.service';

@Module({
  controllers: [CourseController],
  providers: [CourseService, CalculateReviews],
  exports: [CourseService],
})
export class CourseModule {}
