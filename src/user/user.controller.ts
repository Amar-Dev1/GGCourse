import { Controller, Get, Patch, Param, Body, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  async findAll(@Res() res) {
    try {
      const result = await this.userService.findAll();
      res.json(result);
    } catch (err) {
      res.json({ Error: err.message || 'faild to fetch all users' });
    }
  }
  @Get(':id')
  async findOne(@Param() params:{id:string},@Res() res) {
    try {
      const result = await this.userService.findOneById(params.id);
      res.json(result);
    } catch (err) {
      res.json({ Error: err.message || 'faild to fetch this user' });
    }
  }


  @Patch(':id')
  async updateUser(
    @Body() data: UpdateUserDto,
    @Param() prams: { id: string },
    @Res() res,
  ) {
    try {
      const result = await this.userService.updateUser(prams.id, data);
      return res.json({ message: 'updated Successfuly !', data: result });
    } catch (err) {
      res.json({ Error: err?.message || 'faild to update the user' });
    }
  }
}