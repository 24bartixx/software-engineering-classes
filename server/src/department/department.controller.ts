import {Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { DepartmentService } from "./department.service";
import { Department } from "./entities/department.entity";
import { CreateDepartmentDto } from "./dto/create-department.dto";
import { UpdateDepartmentDto } from "./dto/update-department.dto";

@Controller('departments')
export class DepartmentController {
    constructor(private readonly departmentService: DepartmentService) {}

    @Post()
    async create(@Body() createDepartmentDto: CreateDepartmentDto): Promise<Department> {
        return await this.departmentService.create(createDepartmentDto);
    }

    @Get()
    async findAll(): Promise<Department[]> {
        return await this.departmentService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number): Promise<Department> {
        return await this.departmentService.findOne(id);
    }

    @Patch(':id')
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateDepartmentDto: UpdateDepartmentDto,
    ): Promise<Department> {
        return await this.departmentService.update(id, updateDepartmentDto);
    }

    @Delete(':id')
    async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
        return await this.departmentService.remove(id);
    }
}
