import { Controller, Get, Patch, Param, Body, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  async findAll() {
    const result = await this.userService.findAll();
    return { data: result };
  }
  @Get(':id')
  async findOne(@Param() params: { id: string }) {
    const result = await this.userService.findOneById(params.id);
    return { data: result };
  }

  @Patch(':id')
  async updateUser(
    @Body() data: UpdateUserDto,
    @Param() prams: { id: string },
  ) {
    const result = await this.userService.updateUser(prams.id, data);
    return { message: 'updated Successfuly !', data: result };
  }
}
