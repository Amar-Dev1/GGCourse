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
  async create(@Res() res, @Body() data: CreateCourseDto) {
    try {
      const result = await this.courseService.createCourse(data);
      res.json({ message: 'course created successfuly !', data: result });
    } catch (err) {
      res.json({ Error: err.message || 'faild to create the course' });
    }
  }

  @Get()
  async findAll(@Res() res) {
    try {
      const courses = await this.courseService.findAll();
      res.json(courses);
    } catch (err) {
      res.json({ Error: err.message || 'faild to fetch all courses' });
    }
  }

  @Get(':id')
  async findOne(@Res() res, @Param() params: { id: string }) {
    try {
      const course = await this.courseService.findOne(params.id);
      res.json(course);
    } catch (err) {
      res.json({ Error: err.message || 'faild to fetch the course' });
    }
  }

  @Patch(':id')
  async update(
    @Res() res,
    @Param() params: { id: string },
    @Body() data: UpdateCourseDto,
  ) {
    try {
      const updated_course = await this.courseService.updateCourse(
        params.id,
        data,
      );
      
      res.json(updated_course);
    } catch (err) {
      res.json({ Error: err.message || 'faild to update the course' });
    }
  }
  
  @Delete(':id')
  async remove(@Res() res, @Param() params: { id: string }) {
    try {
      const deleted_course = await this.courseService.deleteCourse(params.id);
      res.json({
        messge: 'course deleted successfuly !',
        data: deleted_course,
      });
    } catch (err) {
      res.json({ Error: err.message || 'faild to delete the course' });
    }
  }
}
