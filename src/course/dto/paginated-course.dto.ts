import { IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';

export class PaginatedCourseDto {
  @IsOptional()
  @IsNumber()
  @IsPositive()
  page: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  limit: number;

  @IsString()
  @IsOptional()
  search:string
}
