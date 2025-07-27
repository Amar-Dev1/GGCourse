import { IsNotEmpty, IsString } from "class-validator";

export class CreateReviewDto {
    @IsNotEmpty({ message: 'userId should be defined' })
      @IsString()
      userId: string;
    
      @IsNotEmpty({ message: 'courseId should be defined' })
      @IsString()
      courseId: string;
}
