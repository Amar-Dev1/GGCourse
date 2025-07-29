import { Transform } from 'class-transformer';
import { IsBoolean } from 'class-validator';

export class updateEnrollmentDto {
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  completed: boolean;
}
