import { Injectable } from '@nestjs/common';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { PrismaService } from 'src/prisma.service';
import { ValidateService } from './validation.service';

@Injectable()
export class LessonService {
  constructor(
    private prisma: PrismaService,
    private validateService: ValidateService,
  ) {}

  async create(course_id: string, data: CreateLessonDto) {
    await this.validateService.validateSection(course_id, data.sectionId);

    const lesson = await this.prisma.lesson.create({
      data: {
        title: data.title,
        videoUrl: data.videoUrl,
        sectionId: data.sectionId,
      },
    });

    return lesson;
  }

  async findAll(course_id: string, section_id: string) {
    await this.validateService.validateSection(course_id, section_id);
    const lessons = await this.prisma.lesson.findMany({
      where: {
        sectionId: section_id,
      },
    });
    return lessons;
  }

  async findOne(course_id: string, section_id: string, id: string) {
      await this.validateService.validateSection(course_id, section_id);
      const lesson = await this.validateService.validateLesson(section_id, id);

      return lesson;
   
  }

  async update(course_id: string, id: string, data: UpdateLessonDto) {
    await this.validateService.validateSection(course_id, data.sectionId!);

    await this.validateService.validateLesson(data.sectionId!, id);

    const lesson = await this.prisma.lesson.create({
      data: {
        title: data.title!,
        videoUrl: data.videoUrl!,
        sectionId: data.sectionId!,
      },
    });

    return lesson;
  }

  async delete(course_id: string, section_id: string, id: string) {
    await this.validateService.validateSection(course_id, section_id);

    await this.validateService.validateLesson(section_id, id);

    const deleted_lesson = await this.prisma.lesson.delete({
      where: {
        lesson_id: id,
      },
    });

    return deleted_lesson;
  }
}
