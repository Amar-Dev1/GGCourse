import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { LessonService } from './lesson.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { CourseService } from 'src/course/course.service';

@UseGuards(AuthGuard)
@Controller('courses')
export class LessonController {
  constructor(
    private readonly lessonService: LessonService,
    private courseService: CourseService,
  ) {}

  // ✔
  @Post(':course_id/sections/:section_id/lessons')
  async create(
    @Param() params: { course_id: string; section_id: string },
    @Body() data: CreateLessonDto,
    @CurrentUser() user,
  ) {
    if (user === 'STUDENT') {
      throw new UnauthorizedException('Students can`t make lessons');
    }

    const lesson = await this.lessonService.create(params.course_id, {
      title: data.title,
      videoUrl: data.videoUrl,
      sectionId: params.section_id,
    });

    return {
      message: 'lesson created successfuly !',
      data: lesson,
    };
  }
  // ✔
  @Get(':course_id/sections/:section_id/lessons')
  async findAll(@Param() params: { course_id: string; section_id: string }) {
    const lessons = await this.lessonService.findAll(
      params.course_id,
      params.section_id,
    );

    return {
      data: lessons,
    };
  }

  // ✔
  @Get(':course_id/sections/:section_id/lessons/:id')
  async findOne(
    @Param() params: { course_id: string; section_id: string; id: string },
  ) {
    const lesson = await this.lessonService.findOne(
      params.course_id,
      params.section_id,
      params.id,
    );

    return {
      data: lesson,
    };
  }
  // ✔
  @Patch(':course_id/sections/:section_id/lessons/:id')
  async update(
    @Param() params: { course_id: string; section_id: string; id: string },
    @Body() data: UpdateLessonDto,
    @CurrentUser() user,
  ) {
    if (user === 'STUDENT') {
      throw new UnauthorizedException('Students can`t make lessons');
    }

    const course = await this.courseService.findOne(params.course_id);

    if (course.instructorId !== user.userId) {
      throw new UnauthorizedException('Access denied');
    }

    const updated_lesson = await this.lessonService.update(
      params.course_id,
      params.id,
      {
        title: data.title,
        videoUrl: data.videoUrl,
        sectionId: params.section_id,
      },
    );

    return {
      message: 'Lesson updated successfuly !',
      data: updated_lesson,
    };
  }
  // ✔
  @Delete(':course_id/sections/:section_id/lessons/:id')
  async remove(
    @Param() params: { course_id: string; section_id: string; id: string },
    @CurrentUser() user,
  ) {
    if (user === 'STUDENT') {
      throw new UnauthorizedException('Students can`t make lessons');
    }

    const course = await this.courseService.findOne(params.course_id);

    if (course.instructorId !== user.userId) {
      throw new UnauthorizedException('Access denied');
    }

    const deleted_lesson = await this.lessonService.delete(
      params.course_id,
      params.section_id,
      params.id,
    );
    return {
      message: 'Lesson deleted successfuly !',
      data: deleted_lesson,
    };
  }
}
