import { Type } from 'class-transformer';
import { IsIn, IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';

export class CourseQueryDto {
  @IsOptional()
  @IsNumber()
  @Type(()=>Number)
  @IsPositive()
  page?: number;
  
  @IsOptional()
  @IsNumber()
  @Type(()=>Number)
  @IsPositive()
  limit?: number;

  @IsString()
  @IsOptional()
  search?: string;

  @IsOptional()
  @IsString()
  @IsIn(['newest', 'reviews'])
  sorted_by?: 'newest' | 'reviews';
}
