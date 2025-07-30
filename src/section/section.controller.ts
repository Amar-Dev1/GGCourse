import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { SectionService } from './section.service';
import { UpdateSectionDto } from './dto/update-section.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { CourseService } from 'src/course/course.service';
import { CreateSectionDto } from './dto/create-section.dto';

@UseGuards(AuthGuard)
@Controller('courses')
export class SectionController {
  constructor(
    private readonly sectionService: SectionService,
    private readonly courseService: CourseService,
  ) {}

  // ✔
  @Post(':course_id/sections')
  async create(
    @Body() data: CreateSectionDto,
    @Param('course_id') course_id: string,
    @CurrentUser() user,
  ) {
    if (user.role === 'STUDENT')
      throw new UnauthorizedException(
        'Students can`t create course`s sections',
      );

    const section = await this.sectionService.create({
      title: data.title,
      courseId: course_id,
    });

    return {
      message: 'Section created successfuly !',
      data: section,
    };
  }
  // ✔
  @Get(':course_id/sections')
  async findAll(@Param('course_id') course_id: string) {
    // if (user.role === 'STUDENT') {
    //   throw new UnauthorizedException('Access denied');
    // }

    const sections = await this.sectionService.findAll(course_id);

    return {
      data: sections,
    };
  }

  // ✔
  @Get(':course_id/:sections/:id')
  async findOne(
    @Param() params: { course_id: string; id: string },
    @CurrentUser() user,
  ) {
    if (user.role === 'STUDENT')
      throw new UnauthorizedException('Access denied');
    const section = await this.sectionService.findOne(
      params.course_id,
      params.id,
    );

    return {
      data: section,
    };
  }

  // ✔
  @Patch(':course_id/:section_id/:id')
  async update(
    @Param() params: { course_id: string; id: string },
    @Body() data: UpdateSectionDto,
    @CurrentUser() user,
  ) {
    if (user.role === 'STUDENT')
      throw new UnauthorizedException('Access denied');

    const course = await this.courseService.findOne(params.course_id,true);
    if (course.instructorId !== user.userId)
      throw new UnauthorizedException('Access denied');

    const updated_section = await this.sectionService.update(
      params.course_id,
      params.id,
      {
        title: data.title,
      },
    );
    return {
      message: 'Section updated successfuly !',
      data: updated_section,
    };
  }
  // ✔
  @Delete(':course_id/sections/:id')
  async delete(
    @Param() params: { course_id: string; id: string },
    @CurrentUser() user,
  ) {
    if (user.role === 'STUDENT')
      throw new UnauthorizedException('Access denied');

    const course = await this.courseService.findOne(params.course_id, true);
    if (course.instructorId !== user.userId)
      throw new UnauthorizedException('Access denied');

    const deleted_section = await this.sectionService.delete(
      params.course_id,
      params.id,
    );

    return {
      message: 'Section deleted Successfuly !',
      data: deleted_section,
    };
  }
}
