import { Transform } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateEnrollmentDto {
  @IsNotEmpty({ message: 'userId should be defined' })
  @IsString()
  userId: string;

  @IsNotEmpty({ message: 'courseId should be defined' })
  @IsString()
  courseId: string;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  completed: boolean;
}
