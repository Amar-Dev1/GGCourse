import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
} from '@nestjs/common';
import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@Controller('courses')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Post()
  async create(@Body() data: CreateCourseDto) {
    const result = await this.courseService.createCourse(data);
    return {
      message: 'Course created successfully!',
      data: result,
    };
  }

  @Get()
  async findAll() {
    const courses = await this.courseService.findAll();
    return { courses: courses };
  }

  @Get(':id')
  async findOne(@Param() params: { id: string }) {
    const course = await this.courseService.findOne(params.id);
    return {
      data: course,
    };
  }

  @Patch(':id')
  async update(@Param() params: { id: string }, @Body() data: UpdateCourseDto) {
    const updated_course = await this.courseService.updateCourse(
      params.id,
      data,
    );

    return { message: 'course updated successfuly !', data: updated_course };
  }

  @Delete(':id')
  async remove(@Param() params: { id: string }) {
    const deleted_course = await this.courseService.deleteCourse(params.id);
    return {
      messge: 'course deleted successfuly !',
      data: deleted_course,
    };
  }
}
