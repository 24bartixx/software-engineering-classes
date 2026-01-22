import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { AdministratorService } from './administrator.service';
import { UpdateAdministratorDto } from './dto/update-administrator.dto';
import { CreateAdministratorDto } from './dto/create-administrator.dto';
import { Administrator } from './entities/administrator.entity';

@Controller('administrators')
@UseInterceptors(ClassSerializerInterceptor)
export class AdministratorController {
  constructor(private readonly administratorService: AdministratorService) {}

  @Post()
  async create(
    @Body() createAdministratorDto: CreateAdministratorDto,
  ): Promise<Administrator> {
    return await this.administratorService.create(createAdministratorDto);
  }

  @Get()
  async findAll(): Promise<Administrator[]> {
    return await this.administratorService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Administrator> {
    return await this.administratorService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAdministratorDto: UpdateAdministratorDto,
  ): Promise<Administrator> {
    return await this.administratorService.update(id, updateAdministratorDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return await this.administratorService.remove(id);
  }
}
