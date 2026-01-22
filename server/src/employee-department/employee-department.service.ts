import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EmployeeDepartment } from './entities/employee-department.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEmployeeDepartmentDto } from './dto/create-employee-department.dto';
import { UpdateEmployeeDepartmentDto } from './dto/update-employee-department.dto';
import { Employee } from 'src/employee/entities/employee.entity';
import { Department } from 'src/department/entities/department.entity';

@Injectable()
export class EmployeeDepartmentService {
  constructor(
    @InjectRepository(EmployeeDepartment)
    private readonly employeeDepartmentRepository: Repository<EmployeeDepartment>,
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
    @InjectRepository(Department)
    private readonly departmentRepository: Repository<Department>,
  ) {}

  async create(
    createEmployeeDepartmentDto: CreateEmployeeDepartmentDto,
  ): Promise<EmployeeDepartment> {
    await this.ensureEmployeeExists(createEmployeeDepartmentDto.employeeId);
    await this.ensureDepartmentExists(createEmployeeDepartmentDto.departmentId);
    await this.ensureEmployeeDepartmentNotExist(
      createEmployeeDepartmentDto.employeeId,
      createEmployeeDepartmentDto.departmentId,
    );

    const employeeDepartment = this.employeeDepartmentRepository.create(
      createEmployeeDepartmentDto,
    );
    return await this.employeeDepartmentRepository.save(employeeDepartment);
  }

  async findAll(): Promise<EmployeeDepartment[]> {
    return await this.employeeDepartmentRepository.find({
      relations: ['employee', 'employee.user', 'department'],
    });
  }

  async findOne(
    employeeId: number,
    departmentId: number,
  ): Promise<EmployeeDepartment> {
    const employeeDepartment = await this.employeeDepartmentRepository.findOne({
      where: { employeeId: employeeId, departmentId: departmentId },
      relations: ['employee', 'employee.user', 'department'],
    });
    if (!employeeDepartment) {
      throw new NotFoundException(
        `EmployeeDepartment with employeeId ${employeeId} and departmentId ${departmentId} not found`,
      );
    }
    return employeeDepartment;
  }

  async update(
    employeeId: number,
    departmentId: number,
    updateEmployeeDepartmentDto: UpdateEmployeeDepartmentDto,
  ): Promise<EmployeeDepartment> {
    const employeeDepartment = await this.findOne(employeeId, departmentId);
    Object.assign(employeeDepartment, updateEmployeeDepartmentDto);
    return await this.employeeDepartmentRepository.save(employeeDepartment);
  }

  async remove(employeeId: number, departmentId: number): Promise<void> {
    const employeeDepartment = await this.findOne(employeeId, departmentId);
    await this.employeeDepartmentRepository.remove(employeeDepartment);
  }

  private async ensureEmployeeExists(employeeId: number) {
    const employee = await this.employeeRepository.findOne({
      where: { id: employeeId },
    });
    if (!employee) {
      throw new NotFoundException(`Employee with ID ${employeeId} not found`);
    }
  }

  private async ensureDepartmentExists(departmentId: number) {
    const department = await this.departmentRepository.findOne({
      where: { id: departmentId },
    });
    if (!department) {
      throw new NotFoundException(
        `Department with ID ${departmentId} not found`,
      );
    }
  }

  private async ensureEmployeeDepartmentNotExist(
    employeeId: number,
    departmentId: number,
  ) {
    const existing = await this.employeeDepartmentRepository.findOneBy({
      employeeId: employeeId,
      departmentId: departmentId,
    });
    if (existing) {
      throw new BadRequestException(
        'This employee is already assigned to this department (record exists).',
      );
    }
  }
}
