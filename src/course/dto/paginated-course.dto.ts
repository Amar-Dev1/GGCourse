import { IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';

export class PaginatedCourseDto {
  @IsNumber()
  @IsPositive()
  @IsOptional()
  page: number;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  limit: number;

  @IsString()
  @IsOptional()
  search:string
}
