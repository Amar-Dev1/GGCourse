import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserService } from 'src/user/user.service';
import { LocalStrategy } from './strategies/local.strtategy';

@Module({
  controllers: [AuthController],
  providers: [AuthService, UserService,LocalStrategy],
})
export class AuthModule {}
