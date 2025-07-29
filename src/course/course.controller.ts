import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
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

@Controller('courses')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @UseGuards(AuthGuard)
  @Post()
  async create(@Body() data: CreateCourseDto, @CurrentUser() user) {
    if (user.role === 'STUDENT')
      throw new UnauthorizedException('Access denied');
    const result = await this.courseService.createCourse(data);
    return {
      message: 'Course created successfully!',
      data: result,
    };
  }
  
  // @UseGuards(AuthGuard)
  @Get()
  async findAll(@Query() query: PaginatedCourseDto) {
    const courses = await this.courseService.findAll(query);
    return { courses: courses };
  }
  
  // only student can access
  @UseGuards(AuthGuard)
  @Get('me')
  async findByStudentId(@CurrentUser() user) {

      console.log(user);
      if (user.role !== 'STUDENT')
        throw new UnauthorizedException('Acces denied');
  
      const courses = await this.courseService.findByStudentId(user.userId);
      return {
        data: courses,
      };
    
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async findOne(@Param() params: { id: string }) {
    const course = await this.courseService.findOne(params.id);
    return {
      data: course,
    };
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  async update(
    @Param() params: { id: string },
    @Body() data: UpdateCourseDto,
    @CurrentUser() user,
  ) {
    console.log(user);

    if (user.role === 'STUDENT')
      throw new UnauthorizedException('Access denied');

    const updated_course = await this.courseService.updateCourse(
      params.id,
      data,
    );

    return { message: 'course updated successfuly !', data: updated_course };
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async remove(@Param() params: { id: string }, @CurrentUser() user) {
    if (user.role === 'STUDENT')
      throw new UnauthorizedException('Access denied');
    const deleted_course = await this.courseService.deleteCourse(params.id);
    return {
      messge: 'course deleted successfuly !',
      data: deleted_course,
    };
  }
}
