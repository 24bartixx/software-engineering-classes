import {BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Employee } from "./entities/employee.entity";
import { Repository } from "typeorm";
import { CreateEmployeeDto } from "./dto/create-employee.dto";
import { UpdateEmployeeDto } from "./dto/update-employee.dto";
import { User } from "src/users/entities/user.entity";

@Injectable()
export class EmployeeService {
    constructor(
        @InjectRepository(Employee)
        private readonly employeeRepository: Repository<Employee>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    async create(createEmployeeDto: CreateEmployeeDto): Promise<Employee> {
        const user = await this.ensureUserExists(createEmployeeDto.userId);
        await this.ensureUserIsNotEmployee(createEmployeeDto.userId);
        const employee = this.employeeRepository.create({
            ...createEmployeeDto,
            user: user,
        });
        return await this.employeeRepository.save(employee);
    }

    async findAll(): Promise<Employee[]> {
        return await this.employeeRepository.find({
            relations: ['user', 'departmentsHistory', 'departmentsHistory.department'],
        });
    }

    async findOne(id: number): Promise<Employee> {
        const employee = await this.employeeRepository.findOne({
            where: { id: id },
            relations: ['user', 'departmentsHistory', 'departmentsHistory.department'],
        });
        if (!employee) {
            throw new NotFoundException(`Employee with ID ${id} not found`);
        }
        return employee;
    }

    async update(
        id: number,
        updateEmployeeDto: UpdateEmployeeDto,
    ): Promise<Employee> {
        const employee = await this.findOne(id);
        const { userId, ...rest } = updateEmployeeDto;
        Object.assign(employee, rest);
        if (userId) {
            const user = await this.ensureUserExists(userId);
            if (employee.user.user_id !== userId) {
                await this.ensureUserIsNotEmployee(userId);
            }
            employee.user = user;
        }
        return await this.employeeRepository.save(employee);
    }

    async remove(id: number): Promise<void> {
        const employee = await this.findOne(id);
        await this.employeeRepository.remove(employee);
    }

    private async ensureUserExists(userId: number): Promise<User> {
        const user = await this.userRepository.findOneBy({ user_id: userId });
        if (!user) {
            throw new NotFoundException(`User with ID ${userId} not found`);
        }
        return user;
    }

    private async ensureUserIsNotEmployee(userId: number): Promise<void> {
        const existingEmployee = await this.employeeRepository.findOneBy({ user: {user_id: userId} });
        if (existingEmployee) {
            throw new BadRequestException(`User with ID ${userId} is already an employee`);
        }
    }
}
