import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  UseGuards,
  Delete,
  UnauthorizedException,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(AuthGuard)
  @Get()
  async findAll(@CurrentUser() user) {
    if (user.role !== 'ADMIN') {
      throw new UnauthorizedException('Only Admins can see all users');
    }
    const result = await this.userService.findAll();
    return { data: result };
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async findOne(@Param() params: { id: string }, @CurrentUser() user) {
    if (user.role !== 'ADMIN' && params.id !== user.userId)
      throw new UnauthorizedException('Access denied');
    const result = await this.userService.findOneById(params.id);
    return { data: result };
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  async updateUser(
    @Body() data:UpdateUserDto,
    @Param() params: { id: string },
    @CurrentUser() user,
  ) {
    try {
      if (user.role !== 'ADMIN' && params.id !== user.userId)
        throw new UnauthorizedException('Access denined');

      const result = await this.userService.updateUser(
        params.id,
        data,
      );
      return { message: 'updated Successfuly !', data: result };
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async deleteUser(@Param() params: { id: string }, @CurrentUser() user) {
    if (user.role !== 'ADMIN' && params.id !== user.userId)
      throw new UnauthorizedException('Access denined');
    const result = await this.userService.deleteUser(params.id);
    return {
      message: 'deleted successfuly !',
      data: result,
    };
  }
}
