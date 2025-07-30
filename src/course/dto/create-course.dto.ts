import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator';

export class CreateCourseDto {
  @IsString()
  @MinLength(3, { message: 'Title should be at least 3 characters' })
  title: string;

  @IsString()
  @MinLength(5, { message: 'Description should be at least 5 characters' })
  description: string;
  @Min(5, { message: 'Price should be at least 5$' })
  price: number;

  @IsOptional()
  @IsString()
  instructorId: string | any;
}
