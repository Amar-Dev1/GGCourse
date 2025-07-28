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
import { EnrollmentService } from './enrollment.service';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';

@Controller('enrollments')
export class EnrollmentController {
  constructor(private readonly enrollmentService: EnrollmentService) {}

  @UseGuards(AuthGuard)
  @Post()
  async create(@Body() data: CreateEnrollmentDto) {
    const result = await this.enrollmentService.create(data);
    return { message: 'enrollment issued successfuly !', data: result };
  }
  @UseGuards(AuthGuard)
  @Get()
  async findAll() {
    const data = await this.enrollmentService.findAll();
    return {
      data: data,
    };
  }
  @UseGuards(AuthGuard)
  @Get(':id')
  async findOne(@Param() params: { id: string }, @CurrentUser() user) {
    if (params.id !== user.id) throw new UnauthorizedException('Acess denied');
    const data = await this.enrollmentService.findOne(params.id);
    return {
      data: data,
    };
  }

  @Patch(':id')
  async update(
    @Body() data,
    @Param() params: { id: string },
    @CurrentUser() user,
  ) {
    if (params.id !== user.id) throw new UnauthorizedException('Acess denied');

    const enrollment = await this.enrollmentService.updateEnrollment(
      params.id,
      data,
    );
    return {
      message: 'Updated successfuly !',
      data: enrollment,
    };
  }

  @Delete(':id')
  async delete(@Param() params: { id: string }, @CurrentUser() user) {
    if (params.id !== user.id) throw new UnauthorizedException('Acess denied');

    const data = await this.enrollmentService.delete(params.id);
    return {
      message: 'Unenrolled Successfuly !',
      data: data,
    };
  }
}
