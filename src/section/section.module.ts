import { Module } from '@nestjs/common';
import { SectionService } from './section.service';
import { SectionController } from './section.controller';
import { CourseService } from 'src/course/course.service';
import { CourseController } from 'src/course/course.controller';

@Module({
  controllers: [SectionController, CourseController],
  providers: [SectionService, CourseService],
})
export class SectionModule {}
