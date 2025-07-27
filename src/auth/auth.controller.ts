import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() data: CreateUserDto) {
    const result = await this.authService.register(data);
    return { message: 'User Created Successfuly !', data: result };
  }
  @Post('login')
  async signIn(@Body() data: { email: string; password: string }) {
    const result = await this.authService.signIn(data);
    return { message: 'Logged in Successfuly !', data: result };
  }
}
