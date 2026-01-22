import {Body, ClassSerializerInterceptor, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseInterceptors } from '@nestjs/common';
import { EmployeeDepartmentService } from "./employee-department.service";
import { CreateEmployeeDepartmentDto } from "./dto/create-employee-department.dto";
import { EmployeeDepartment } from "./entities/employee-department.entity";
import { UpdateEmployeeDepartmentDto } from "./dto/update-employee-department.dto";

@Controller('employee-departments')
@UseInterceptors(ClassSerializerInterceptor)
export class EmployeeDepartmentController {
    constructor(private readonly employeeDepartmentService: EmployeeDepartmentService) {}

    @Post()
    async create(@Body() createEmployeeDepartmentDto: CreateEmployeeDepartmentDto): Promise<EmployeeDepartment> {
        return await this.employeeDepartmentService.create(createEmployeeDepartmentDto);
    }

    @Get()
    async findAll(): Promise<EmployeeDepartment[]> {
        return await this.employeeDepartmentService.findAll();
    }

    @Get(':employeeId/:departmentId')
    async findOne(
        @Param('employeeId', ParseIntPipe) employeeId: number,
        @Param('departmentId', ParseIntPipe) departmentId: number,
    ): Promise<EmployeeDepartment> {
        return await this.employeeDepartmentService.findOne(employeeId, departmentId);
    }

    @Patch(':employeeId/:departmentId')
    async update(
        @Param('employeeId', ParseIntPipe) employeeId: number,
        @Param('departmentId', ParseIntPipe) departmentId: number,
        @Body() updateEmployeeDepartmentDto: UpdateEmployeeDepartmentDto,
    ): Promise<EmployeeDepartment> {
        return await this.employeeDepartmentService.update(employeeId, departmentId, updateEmployeeDepartmentDto);
    }

    @Delete(':employeeId/:departmentId')
    async remove(
        @Param('employeeId', ParseIntPipe) employeeId: number,
        @Param('departmentId', ParseIntPipe) departmentId: number,
    ): Promise<void> {
        return await this.employeeDepartmentService.remove(employeeId, departmentId);
    }
}
