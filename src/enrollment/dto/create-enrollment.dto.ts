import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateEnrollmentDto {
  @IsNotEmpty({ message: 'userId should be defined' })
  @IsString()
  userId: string;

  @IsNotEmpty({ message: 'courseId should be defined' })
  @IsString()
  courseId: string;

}
