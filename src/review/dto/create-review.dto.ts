import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateReviewDto {
  @IsOptional()
  @IsNotEmpty({ message: 'userId should be defined' })
  @IsString()
  userId: string;

  @IsOptional()
  @IsNotEmpty({ message: 'courseId should be defined' })
  @IsString()
  courseId: string;

  @IsInt({ message: 'the rate should be a number' })
  @Min(1, { message: 'the rate must be 1 at least' })
  @Max(5, { message: 'the rate must be 5 at most' })
  rating: number;
}
