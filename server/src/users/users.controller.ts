import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  ClassSerializerInterceptor,
  ParseIntPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserProfileDto } from './dto/user-profile.dto';
import { EditUserDto } from './dto/edit-user.dto';

@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Get('profile/:id')
  getUserProfile(@Param('id') id: string): Promise<UserProfileDto> {
    return this.usersService.getUserProfile(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }

  @Post('edit-user/:id')
  async editUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() editUserDto: EditUserDto,
  ) {
    await this.usersService.editUser(id, editUserDto);
    return { message: 'User updated successfully!' };
  }

  @Get('get-address/:id')
  async getAddress(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.getAddress(id);
  }

  @Post('remove-address/:id')
  async removeAddress(@Param('id', ParseIntPipe) id: number) {
    await this.usersService.removeAddress(id);
    return { message: 'Address removed successfully!' };
  }
}
