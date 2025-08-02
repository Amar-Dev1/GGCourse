import { Injectable, NotFoundException } from '@nestjs/common';
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
        description: data.description,
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
        description: data.description!,
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

  async completeLesson(lesson_id: string, user_id: string) {
    return this.prisma.$transaction(async (tx) => {
      // 1. finding the lesson to get its section and course ids
      const lesson = await tx.lesson.findUnique({
        where: { lesson_id: lesson_id },
        select: { section: { select: { section_id: true, courseId: true } } },
      });

      if (!lesson || !lesson.section) {
        throw new NotFoundException('Lesson not found');
      }

      const { section_id: sectionId, courseId } = lesson.section;

      // 2. mark the lesson as completed
      await tx.lessonProgress.upsert({
        where: { userId_lessonId: { userId: user_id, lessonId: lesson_id } },
        create: { userId: user_id, lessonId: lesson_id, completed: true },
        update: { completed: true },
      });

      // 3. check if the entire section is completed
      const incompletedLessonsInSection = await tx.lessonProgress.count({
        where: {
          lesson: {
            sectionId: sectionId,
          },
          userId: user_id,
          completed: false,
        },
      });

      if (incompletedLessonsInSection === 0) {
        // 4. check if the entire course is completed
        const incompletedLessonInCourse = await tx.lessonProgress.count({
          where: {
            lesson: {
              section: {
                courseId: courseId,
              },
            },
            userId: user_id,
            completed: false,
          },
        });
        if (incompletedLessonInCourse === 0) {
          await tx.enrollment.update({
            where: { userId_courseId: { userId: user_id, courseId: courseId } },
            data: { completed: true },
          });
        }
      }

      return { message: 'Lesson completed successfuly !' };
    });
  }
}
