import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}
  @UseGuards(AuthGuard)
  @Post()
  async create(@Body() data: CreateReviewDto) {
    const result = await this.reviewService.create(data);
    return { message: 'review made successfuly !', data: result };
  }

  @Get()
  async findAll() {
    const data = await this.reviewService.findAll();
    return {
      data: data,
    };
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async findOne(@Param() params: { id: string }, @CurrentUser() user) {
    if (params.id !== user.id) throw new UnauthorizedException('Acess denied');

    const data = await this.reviewService.findOne(params.id);
    return {
      data: data,
    };
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async delete(@Param() params: { id: string }, @CurrentUser() user) {
    if (params.id !== user.id) throw new UnauthorizedException('Acess denied');

    const data = await this.reviewService.delete(params.id);
    return {
      message: 'removed a review Successfuly !',
      data: data,
    };
  }
}
