import { Module } from '@nestjs/common';
import { SectionService } from './section.service';
import { SectionController } from './section.controller';
import { CourseModule } from 'src/course/course.module';

@Module({
  imports: [CourseModule],
  controllers: [SectionController],
  providers: [SectionService],
})
export class SectionModule {}
