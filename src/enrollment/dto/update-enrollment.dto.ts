import { IsNotEmpty } from 'class-validator';

export class updateEnrollmentDto {
  @IsNotEmpty()
  completed: boolean;
}
