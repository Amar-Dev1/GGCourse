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
  HttpException,
  NotFoundException,
} from '@nestjs/common';
import { EnrollmentService } from './enrollment.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { updateEnrollmentDto } from './dto/update-enrollment.dto';

@UseGuards(AuthGuard)
@Controller('enrollments')
export class EnrollmentController {
  constructor(private readonly enrollmentService: EnrollmentService) {}

  // Student routes

  @UseGuards(AuthGuard)
  @Post('/:course_id')
  async enroll(@Param('course_id') courseId: string, @CurrentUser() user) {
    if (user.role === 'INSTRUCTOR') {
      throw new UnauthorizedException('Only students can enroll');
    }

    const result = await this.enrollmentService.enroll({
      courseId,
      userId: user.userId,
      completed: false,
    });
    return { message: 'enrollment issued successfuly !', data: result };
  }

  @Get('me')
  async findAllByStudentId(@CurrentUser() user) {
    if (user.role === 'INSTRUCTOR') {
      throw new UnauthorizedException('Access denied');
    } else {
      return {
        data: await this.enrollmentService.findAllByStudentId(user.userId),
      };
    }
  }

  @Get(':enrollment_id')
  async findOne(@Param('enrollment_id') id: string, @CurrentUser() user) {
    if (user.role === 'INSTRUCTOR') {
      throw new UnauthorizedException('Access denied');
    }

    const enrollment = await this.enrollmentService.findOneById(id);

    if (!enrollment) throw new NotFoundException('enrollment not found');
    if (enrollment.userId !== user.userId) {
      throw new UnauthorizedException('Access denied');
    }

    return {
      data: await this.enrollmentService.findOneByStudentId(id),
    };
  }

  @Patch(':enrollment_id')
  async update(
    @Body() data: updateEnrollmentDto,
    @Param('enrollment_id') id: string,
    @CurrentUser() user,
  ) {
    if (user.role === 'INSTRUCTOR') {
      throw new UnauthorizedException('Access denied');
    }

    const enrollment = await this.enrollmentService.findOneById(id);

    if (!enrollment) throw new NotFoundException('enrollment not found');

    if (enrollment.userId !== user.userId) {
      throw new UnauthorizedException('Access denied');
    }

    return {
      message: 'Updated successfuly !',
      data: await this.enrollmentService.updateEnrollment(
        id,
        // user.userId,
        data.completed,
      ),
    };
  }

  @Delete(':enrollment_id')
  async delete(@Param('enrollment_id') id: string, @CurrentUser() user) {
    if (user.role === 'INSTRUCTOR') {
      throw new UnauthorizedException('Access denied');
    }

    const enrollment = await this.enrollmentService.findOneById(id);
    if (!enrollment) throw new NotFoundException('enrollment not found');
    if (enrollment.userId !== user.userId) {
      throw new UnauthorizedException('Access denied');
    }
    return {
      message: 'Unenrolled Successfuly !',
      data: await this.enrollmentService.delete(id),
    };
  }

  // Instructor routes

  @Get('/course/:course_id')
  async findAllByCourse(@Param('course_id') id: string, @CurrentUser() user) {
    if (user.role === 'STUDENT') {
      throw new UnauthorizedException('Access denied');
    }

    const enrollments = await this.enrollmentService.findAllByCourseId(id);
    return {
      data: enrollments,
    };
  }
}
