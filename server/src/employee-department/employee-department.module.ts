import { Module } from '@nestjs/common';
import { EmployeeDepartmentService } from './employee-department.service';
import { EmployeeDepartmentController } from './employee-department.controller';
import { EmployeeDepartment } from "./entities/employee-department.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Employee } from "src/employee/entities/employee.entity";
import { Department } from "src/department/entities/department.entity";

@Module({
    imports: [TypeOrmModule.forFeature([EmployeeDepartment, Employee, Department])],
    controllers: [EmployeeDepartmentController],
    providers: [EmployeeDepartmentService]
})
export class EmployeeDepartmentModule {}
