import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { EnrollmentService } from './enrollment.service';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';

@Controller('enrollments')
export class EnrollmentController {
  constructor(private readonly enrollmentService: EnrollmentService) {}

  @Post()
  async create(@Body() data: CreateEnrollmentDto) {
    const result = await this.enrollmentService.create(data);
    return { message: 'enrollment issued successfuly !', data: result };
  }

  @Get()
  async findAll() {
    const data = await this.enrollmentService.findAll();
    return {
      data: data,
    };
  }

  @Get(':id')
  async findOne(@Param() params: { id: string }) {
    const data = await this.enrollmentService.findOne(params.id);
    return {
      data: data,
    };
  }

  @Delete(':id')
  async delete(@Param() params: { id: string }) {
    const data = await this.enrollmentService.delete(params.id);
    return {
      message: 'Unenrolled Successfuly !',
      data: data,
    };
  }
}
