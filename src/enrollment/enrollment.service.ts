import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class EnrollmentService {
  constructor(private prisma: PrismaService) {}

  async enroll(data: CreateEnrollmentDto) {
    const user = await this.prisma.user.findUnique({
      where: { user_id: data.userId },
    });
    const course = await this.prisma.course.findUnique({
      where: { course_id: data.courseId },
    });
    if (!user) throw new HttpException('user not found', HttpStatus.NOT_FOUND);
    if (!course)
      throw new HttpException('course not found', HttpStatus.NOT_FOUND);

    const enrollment = await this.prisma.enrollment.create({
      data: {
        userId: user.user_id,
        courseId: course.course_id,
      },
    });
    return enrollment;
  }

  async findAllByCourseId(course_id: string,user_id:string) {
    const enrollments = await this.prisma.enrollment.findMany({
      where: { courseId: course_id,userId:user_id },
    });
    return enrollments;
  }

  async findAllByStudentId(student_id: string) {
    const enrollments = await this.prisma.enrollment.findMany({
      where: { userId: student_id },
    });
    return enrollments;
  }

  async findOneByStudentId(enrollment_id: string) {
    const enrollment = await this.prisma.enrollment.findUnique({
      where: { enrollment_id: enrollment_id },
    });
    return enrollment;
  }

  async findOneById(enrollment_id: string) {
    const enrollment = await this.prisma.enrollment.findUnique({
      where: { enrollment_id: enrollment_id },
    });
    return enrollment;
  }

  async updateEnrollment(enrollment_id: string, completed: boolean) {
    const enrollment = await this.prisma.enrollment.findUnique({
      where: { enrollment_id: enrollment_id },
    });
    console.log(enrollment);
    if (!enrollment)
      throw new HttpException(
        'You are not enrolled in this course',
        HttpStatus.NOT_FOUND,
      );

    const updated_enrollment = await this.prisma.enrollment.update({
      where: { enrollment_id: enrollment_id },
      data: { completed: completed },
    });

    return updated_enrollment;
  }

  async delete(enrollment_id: string) {
    const enrollment = await this.prisma.enrollment.findUnique({
      where: { enrollment_id: enrollment_id },
    });

    if (!enrollment)
      throw new HttpException(
        'You are not enrolled in this course',
        HttpStatus.NOT_FOUND,
      );
    const deleted_enrollment = await this.prisma.enrollment.delete({
      where: { enrollment_id: enrollment_id },
    });
    return deleted_enrollment;
  }
}
