import { Body, Controller, Post, Request, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { PassportLocalGuard } from './guards/passport-local.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() data: CreateUserDto) {
    const result = await this.authService.register(data);
    return { message: 'User Created Successfuly !', data: result };
  }

  @UseGuards(PassportLocalGuard)
  @Post('login')
  async signIn(@Request() req ,@Body() data: { email: string; password: string }) {
    const result = await this.authService.signIn(data);
    const {password, ...user_details} = req.user;
    const {access_token} = result;
    return { message: 'Logged in Successfuly !', access_token,user_details}
  }
}
