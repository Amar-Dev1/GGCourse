import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { PrismaClient } from 'generated/prisma';
import { updateEnrollmentDto } from './dto/update-enrollment.dto';

const prisma = new PrismaClient();

@Injectable()
export class EnrollmentService {
  async create(data: CreateEnrollmentDto) {
    const user = await prisma.user.findUnique({
      where: { user_id: data.userId },
    });
    const course = await prisma.course.findUnique({
      where: { course_id: data.courseId },
    });
    if (!user) throw new HttpException('user not found', HttpStatus.NOT_FOUND);
    if (!course)
      throw new HttpException('course not found', HttpStatus.NOT_FOUND);

    if (user?.role !== 'STUDENT')
      throw new HttpException(
        'You MUST switch to STUDENT role',
        HttpStatus.FORBIDDEN,
      );

    const enrollment = await prisma.enrollment.create({
      data: {
        userId: user.user_id,
        courseId: course.course_id,
      },
    });
    return enrollment;
  }
  async findAll() {
    const enrollments = await prisma.enrollment.findMany();
    return enrollments;
  }

  async findOne(id: string) {
    const enrollment = await prisma.enrollment.findUnique({
      where: { enrollment_id: id },
    });
    return enrollment;
  }

  async updateEnrollment(id: string, data: updateEnrollmentDto) {
    const enrollment = await this.findOne(id);
    if (!enrollment)
      throw new HttpException(
        'You are not enrolled in this course',
        HttpStatus.NOT_FOUND,
      );
    const updated_enrollment = await prisma.enrollment.update({
      where: { enrollment_id: id },
      data: { completed: data.completed },
    });
    return updated_enrollment;
  }

  async delete(id: string) {
    const enrollment = await prisma.enrollment.findUnique({
      where: { enrollment_id: id },
    });
    if (!enrollment)
      throw new HttpException(
        'You are not enrolled in this course',
        HttpStatus.NOT_FOUND,
      );
    const deleted_enrollment = await prisma.enrollment.delete({
      where: { enrollment_id: id },
    });
    return deleted_enrollment;
  }
}
