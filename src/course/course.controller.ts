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
  Query,
} from '@nestjs/common';
import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { PaginatedCourseDto } from './dto/paginated-course.dto';

@UseGuards(AuthGuard)
@Controller('courses')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Post()
  async create(@Body() data: CreateCourseDto, @CurrentUser() user) {
    if (user.role === 'STUDENT') {
      throw new UnauthorizedException('Access denied');
    }

    const course = await this.courseService.createCourse({
      title: data.title,
      description: data.description,
      price: data.price,
      instructorId: user.userId,
      isReady: data.isReady ? data.isReady : false,
    });
    return {
      message: 'Course created successfully!',
      data: course,
    };
  }

  @Get()
  async findAll(@Query() query: PaginatedCourseDto) {
    const courses = await this.courseService.findAll(query);
    return { courses: courses };
  }

  // only student can access
  @Get('me')
  async findByStudentId(@CurrentUser() user) {
    if (user.role !== 'STUDENT') {
      throw new UnauthorizedException('Acces denied');
    }
    const courses = await this.courseService.findByStudentId(user.userId);
    return {
      data: courses,
    };
  }

  @Get(':id')
  async findOne(@Param() params: { id: string }, @CurrentUser() user) {
    let isAdmin = true;
    if (user.role === 'STUDENT') isAdmin = false;

    const course = await this.courseService.findOne(params.id, isAdmin);
    return {
      data: course,
    };
  }

  @Patch(':id')
  async update(
    @Param() params: { id: string },
    @Body() data: UpdateCourseDto,
    @CurrentUser() user,
  ) {
    if (user.role === 'STUDENT')
      throw new UnauthorizedException('Access denied');

    const course = await this.courseService.findOne(params.id, true);
    if (course.instructorId !== user.userId) {
      throw new UnauthorizedException('Access denied');
    }

    const updated_course = await this.courseService.updateCourse(
      params.id,
      data,
    );

    return { message: 'course updated successfuly !', data: updated_course };
  }

  @Delete(':id')
  async remove(@Param() params: { id: string }, @CurrentUser() user) {
    if (user.role === 'STUDENT')
      throw new UnauthorizedException('Access denied');

    const course = await this.courseService.findOne(params.id, true);
    if (course.instructorId !== user.userId) {
      throw new UnauthorizedException('Access denied');
    }

    const deleted_course = await this.courseService.deleteCourse(params.id);
    return {
      messge: 'course deleted successfuly !',
      data: deleted_course,
    };
  }
}
