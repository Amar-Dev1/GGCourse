import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ValidateService {
  constructor(private prisma: PrismaService) {}

  async validateSection(course_id: string, section_id: string) {
    const section = await this.prisma.section.findFirst({
      where: {
        section_id: section_id,
        courseId: course_id,
      },
    });

    if (!section)
      throw new NotFoundException(
        'Section not found or doesn’t belong to this course',
      );

    return section;
  }

  async validateLesson(section_id: string, lesson_id: string) {
    const lesson = await this.prisma.lesson.findFirst({
      where: {
        sectionId: section_id,
        id: lesson_id,
      },
    });
    if (!lesson)
      throw new NotFoundException(
        'Lesson not found or doesn`t belong to this section',
      );

    return lesson;
  }
}
