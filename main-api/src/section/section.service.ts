import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateSectionDto } from './dto/create-section.dto';
import { UpdateSectionDto } from './dto/update-section.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class SectionService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateSectionDto) {
    // check the instructor ownership
    const course = await this.prisma.course.findUnique({
      where: { course_id: data.courseId },
    });
    if (!course)
      throw new NotFoundException('No course associated with this instructor');

    const section = await this.prisma.section.create({
      data: {
        title: data.title,
        description: data.description,
        courseId: data.courseId,
      },
    });
    return section;
  }

  async findAll(course_id: string) {
    try {
      const course = await this.prisma.course.findUnique({
        where: { course_id: course_id },
      });

      if (!course) {
        throw new NotFoundException('No such course');
      }

      const sections = await this.prisma.section.findMany({
        where: { courseId: course_id },
        include: { lessons: true },
      });
      return sections;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async findOne(course_id: string, id: string) {
    const course = await this.prisma.course.findUnique({
      where: { course_id: course_id },
    });

    if (!course) {
      throw new NotFoundException('No such course');
    }

    const section = await this.prisma.section.findUnique({
      where: { section_id: id },
    });
    console.log(section);
    if (!section) throw new NotFoundException('Section not found');
    return section;
  }

  async update(course_id: string, id: string, data: UpdateSectionDto) {
    const course = await this.prisma.course.findUnique({
      where: { course_id: course_id },
    });

    if (!course) {
      throw new NotFoundException('No such course');
    }

    const section = await this.prisma.section.findUnique({
      where: { section_id: id },
    });
    console.log(section);
    if (!section) throw new NotFoundException('Section not found');

    const updated_section = await this.prisma.section.update({
      data: {
        title: data.title,
        description: data.description ? data.description : '',
      },
      where: { section_id: id },
    });

    return updated_section;
  }

  async delete(course_id: string, id: string) {

    const course = await this.prisma.course.findUnique({
      where: { course_id: course_id },
    });

    if (!course) {
      throw new NotFoundException('No such course');
    }

    const section = await this.prisma.section.findUnique({
      where: { section_id: id },
    });
    console.log(section);
    if (!section) throw new NotFoundException('Section not found');

    const deleted_section = await this.prisma.section.delete({
      where: { section_id: id },
    });
    return deleted_section;
  }
}
