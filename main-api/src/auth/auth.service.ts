import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async register(data: CreateUserDto): Promise<any> {
    const user = await this.userService.findOneByEmail(data.email);
    if (user !== null && user)
      throw new HttpException('user already exists', HttpStatus.BAD_REQUEST);

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const result = await this.userService.createUser({
      ...data,
      password: hashedPassword,
    });
    const { password, ...rest } = result;
    return rest;
  }

  async validateUser(data: { email: string; password: string }) {
    const user = await this.userService.findOneByEmail(data.email);
    if (!user) throw new Error('user not found');

    const matchedPassword = await bcrypt.compare(data.password, user.password);
    if (!matchedPassword)
      throw new HttpException('Invalid credintials', HttpStatus.BAD_REQUEST);

    return user;
  }

  async signIn(data: { email: string; password: string }): Promise<any> {
    const user = await this.validateUser(data);

    const tokenPayload = { sub: user.user_id, username: user.username, role:user.role };

    return {
      access_token: await this.jwtService.signAsync(tokenPayload),
    };
  }
}
