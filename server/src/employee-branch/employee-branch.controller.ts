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
import { EmployeeBranchService } from './employee-branch.service';
import { CreateEmployeeBranchDto } from './dto/create-employee-branch.dto';
import { EmployeeBranch } from './entities/employee-branch.entity';
import { UpdateEmployeeBranchDto } from './dto/update-employee-branch.dto';

@Controller('employee-branches')
@UseInterceptors(ClassSerializerInterceptor)
export class EmployeeBranchController {
  constructor(private readonly employeeBranchService: EmployeeBranchService) {}

  @Post()
  async create(
    @Body() createEmployeeBranchDto: CreateEmployeeBranchDto,
  ): Promise<EmployeeBranch> {
    return await this.employeeBranchService.create(createEmployeeBranchDto);
  }

  @Get()
  async findAll(): Promise<EmployeeBranch[]> {
    return await this.employeeBranchService.findAll();
  }

  @Get(':employeeId/:branchId')
  async findOne(
    @Param('employeeId', ParseIntPipe) employeeId: number,
    @Param('branchId', ParseIntPipe) branchId: number,
  ): Promise<EmployeeBranch> {
    return await this.employeeBranchService.findOne(employeeId, branchId);
  }

  @Patch(':employeeId/:branchId')
  async update(
    @Param('employeeId', ParseIntPipe) employeeId: number,
    @Param('branchId', ParseIntPipe) branchId: number,
    @Body() updateEmployeeBranchDto: UpdateEmployeeBranchDto,
  ): Promise<EmployeeBranch> {
    return await this.employeeBranchService.update(
      employeeId,
      branchId,
      updateEmployeeBranchDto,
    );
  }

  @Delete(':employeeId/:branchId')
  async remove(
    @Param('employeeId', ParseIntPipe) employeeId: number,
    @Param('branchId', ParseIntPipe) branchId: number,
  ): Promise<void> {
    return await this.employeeBranchService.remove(employeeId, branchId);
  }
}
