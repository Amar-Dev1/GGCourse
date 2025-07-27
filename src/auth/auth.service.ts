import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from './JwtService';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async register(data: CreateUserDto): Promise<any> {
    const user = await this.userService.findOneByEmail(data.email);
    if (user) throw new HttpException('user already exists', HttpStatus.BAD_REQUEST);
    
    const hashedPassword = await bcrypt.hash(data.password, 10);
    let result = await this.userService.createUser({
      name: data.name,
      email: data.email,
      username: data.username,
      role: data.role,
      password: hashedPassword,
    });

    const { password, created_at, updated_at, ...finalResult } = result;

    return finalResult;
  }

  async signIn(data: { email: string; password: string }): Promise<any> {
    const user = await this.userService.findOneByEmail(data.email);
    if (!user) throw new Error('user not found');

    const matchedPassword = await bcrypt.compare(data.password, user.password);
    if (!matchedPassword) throw new Error('Invalid credintials');

    const token = this.jwtService.generateToken(user.user_id);
    const { password, updated_at, ...finalData } = user;
    return { finalData, token };
  }
}
