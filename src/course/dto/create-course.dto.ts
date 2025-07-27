import {
  IsNotEmpty,
  IsNumber,
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

  @IsNotEmpty()
  @IsString()
  instructorId: string | any;
}
