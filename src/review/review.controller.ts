import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';

@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

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
  
    @Get(':id')
    async findOne(@Param() params: { id: string }) {
      const data = await this.reviewService.findOne(params.id);
      return {
        data: data,
      };
    }
  
    @Delete(':id')
    async delete(@Param() params: { id: string }) {
      const data = await this.reviewService.delete(params.id);
      return {
        message: 'removed a review Successfuly !',
        data: data,
      };
    }
}
