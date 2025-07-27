import { IsEmail, IsIn, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  name: string;
  @IsEmail()
  email: string;

  @IsNotEmpty()
  username: string;
  @IsNotEmpty()
  password: string | any;

  @IsNotEmpty()
  @IsIn(['STUDENT', 'INSTRUCTOR', 'ADMIN'])
  role: "STUDENT" | "INSTRUCTOR" | "ADMIN";
}
