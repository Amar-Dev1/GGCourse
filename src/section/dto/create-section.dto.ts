import { IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateSectionDto {
  @IsOptional()
  @IsString()
  @MinLength(3, { message: 'title should be at lease 3 characters' })
  title: string;

  @IsOptional()
  @IsString()
  @MinLength(3, { message: 'title should be at lease 3 characters' })
  courseId: string;
}
