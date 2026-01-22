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
import { HrEmployeeService } from './hr-employee.service';
import { UpdateHrEmployeeDto } from './dto/update-hr-employee.dto';
import { CreateHrEmployeeDto } from './dto/create-hr-employee.dto';
import { HrEmployee } from './entities/hr-employee.entity';

@Controller('hr-employees')
@UseInterceptors(ClassSerializerInterceptor)
export class HrEmployeeController {
  constructor(private readonly hrEmployeeService: HrEmployeeService) {}

  @Post()
  async create(
    @Body() createHrEmployeeDto: CreateHrEmployeeDto,
  ): Promise<HrEmployee> {
    return await this.hrEmployeeService.create(createHrEmployeeDto);
  }

  @Get()
  async findAll(): Promise<HrEmployee[]> {
    return await this.hrEmployeeService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<HrEmployee> {
    return await this.hrEmployeeService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateHrEmployeeDto: UpdateHrEmployeeDto,
  ): Promise<HrEmployee> {
    return await this.hrEmployeeService.update(id, updateHrEmployeeDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return await this.hrEmployeeService.remove(id);
  }
}
