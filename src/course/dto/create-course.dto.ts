import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateCourseDto {
  @IsNotEmpty()
  @IsString()
  title: string;
  description: string;
  @IsNumber()
  price: number;

  @IsNotEmpty()
  @IsString()
  instructorId: string | any;
}
