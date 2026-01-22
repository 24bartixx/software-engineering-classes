import {Body, ClassSerializerInterceptor, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseInterceptors } from '@nestjs/common';
import { EmployeeService } from "./employee.service";
import { UpdateEmployeeDto } from "./dto/update-employee.dto";
import { CreateEmployeeDto } from "./dto/create-employee.dto";
import { Employee } from "./entities/employee.entity";

@Controller('employees')
@UseInterceptors(ClassSerializerInterceptor)
export class EmployeeController {
    constructor(private readonly employeeService: EmployeeService) {}

    @Post()
    async create(@Body() createEmployeeDto: CreateEmployeeDto): Promise<Employee> {
        return await this.employeeService.create(createEmployeeDto);
    }

    @Get()
    async findAll(): Promise<Employee[]> {
        return await this.employeeService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number): Promise<Employee> {
        return await this.employeeService.findOne(id);
    }

    @Patch(':id')
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateEmployeeDto: UpdateEmployeeDto,
    ): Promise<Employee> {
        return await this.employeeService.update(id, updateEmployeeDto);
    }

    @Delete(':id')
    async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
        return await this.employeeService.remove(id);
    }
}
