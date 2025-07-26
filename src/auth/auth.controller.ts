import {
  Body,
  Controller,
  Post,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() data: CreateUserDto, @Res() res) {
    try {
     const result = await this.authService.register(data);
     return res.json({message:"User Created Successfuly !", data:result})
    } catch (err) {
      res.status(400).json({"Error":err?.message || "faild to register "})
    }
  }
  @Post('login')
  async signIn(@Body() data : {email:string;password:string} ,@Res() res) {
    try {
     const result = await this.authService.signIn(data);
     return res.json({message:"Logged in Successfuly !", data:result})
    } catch (err) {
      res.status(400).json({"Error":err?.message || "faild to login "})
    }
  }
}
