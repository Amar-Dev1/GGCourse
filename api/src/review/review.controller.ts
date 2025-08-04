import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UnauthorizedException,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@UseGuards(AuthGuard)
@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  // student endpoints
  @Post('/:course_id')
  async review(
    @Body() data: CreateReviewDto,
    @Param('course_id') course_id: string,
    @CurrentUser() user,
  ) {
    if (user.role !== 'STUDENT') {
      throw new UnauthorizedException('Only students can make reivews');
    }

    const result = await this.reviewService.review({
      userId: user.userId,
      courseId: course_id,
      rating: Math.round(data.rating * 10) / 10,
      isReady: data.isReady ? data.isReady : false,
    });

    return { message: 'review made successfuly !', data: result };
  }

  @Get('me')
  async findAllByStudentId(@CurrentUser() user) {
    if (user.role !== 'STUDENT') {
      throw new UnauthorizedException('Access denied');
    }

    const data = await this.reviewService.findAllByStudentId(user.userId);
    return {
      data: data,
    };
  }

  @Get(':review_id')
  async findOne(@Param('review_id') id, @CurrentUser() user) {
    if (user.role === 'INSTRUCTOR')
      throw new UnauthorizedException('Access denied');

    const review = await this.reviewService.findOneById(id);

    if (!review) throw new NotFoundException('Review not found');

    if (review.userId !== user.userId)
      throw new UnauthorizedException('Access denied');

    const data = await this.reviewService.findOneById(id);
    return {
      data: data,
    };
  }

  @Delete(':review_id')
  async delete(@Param('review_id') id: string, @CurrentUser() user) {
    if (user.role === 'INSTRUCTOR')
      throw new UnauthorizedException('Access denied');

    const review = await this.reviewService.findOneById(id);

    if (!review) throw new NotFoundException('Review not found');

    if (review.userId !== user.userId)
      throw new UnauthorizedException('Access denied');

    const data = await this.reviewService.delete(id);
    return {
      message: 'removed a review Successfuly !',
      data: data,
    };
  }

  // instructor endpoints

  @Get('/course/:course_id')
  async findAllByCourseId(@Param('course_id') id: string, @CurrentUser() user) {
    if (user.role === 'STUDENT') {
      throw new UnauthorizedException('Access denied');
    }

    const reviews = await this.reviewService.findAllByCourseId(id);

    return {
      data: reviews,
    };
  }
}
