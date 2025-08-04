import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateSectionDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3, { message: 'title should be at lease 3 characters' })
  title: string;

  @IsOptional()
  @IsString()
  @MinLength(5, { message: 'description should be at lease 5 characters' })
  description: string;

  @IsOptional()
  @IsString()
  courseId: string;
}
