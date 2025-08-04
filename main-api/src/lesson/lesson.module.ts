import { Module } from '@nestjs/common';
import { LessonService } from './lesson.service';
import { CompleteLessonController, LessonController } from './lesson.controller';
import { ValidateService } from './validation.service';
import { CourseService } from 'src/course/course.service';

@Module({
  controllers: [LessonController,CompleteLessonController],
  providers: [LessonService, ValidateService, CourseService],
})
export class LessonModule {}
