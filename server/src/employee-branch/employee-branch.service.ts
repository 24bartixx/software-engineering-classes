import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EmployeeBranch } from './entities/employee-branch.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEmployeeBranchDto } from './dto/create-employee-branch.dto';
import { UpdateEmployeeBranchDto } from './dto/update-employee-branch.dto';
import { Employee } from 'src/employee/entities/employee.entity';
import { Branch } from 'src/branches/entities/branch.entity';

@Injectable()
export class EmployeeBranchService {
  constructor(
    @InjectRepository(EmployeeBranch)
    private readonly employeeBranchRepository: Repository<EmployeeBranch>,
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
    @InjectRepository(Branch)
    private readonly branchRepository: Repository<Branch>,
  ) {}

  async create(
    createEmployeeBranchDto: CreateEmployeeBranchDto,
  ): Promise<EmployeeBranch> {
    await this.ensureEmployeeExists(createEmployeeBranchDto.employeeId);
    await this.ensureBranchExists(createEmployeeBranchDto.branchId);
    await this.ensureEmployeeBranchNotExist(
      createEmployeeBranchDto.employeeId,
      createEmployeeBranchDto.branchId,
    );

    const employeeBranch = this.employeeBranchRepository.create(
      createEmployeeBranchDto,
    );
    return await this.employeeBranchRepository.save(employeeBranch);
  }

  async findAll(): Promise<EmployeeBranch[]> {
    return await this.employeeBranchRepository.find({
      relations: ['employee', 'employee.user', 'branch'],
    });
  }

  async findOne(employeeId: number, branchId: number): Promise<EmployeeBranch> {
    const employeeBranch = await this.employeeBranchRepository.findOne({
      where: { employeeId: employeeId, branchId: branchId },
      relations: ['employee', 'employee.user', 'branch'],
    });
    if (!employeeBranch) {
      throw new NotFoundException(
        `EmployeeBranch with employeeId ${employeeId} and branchId ${branchId} not found`,
      );
    }
    return employeeBranch;
  }

  async update(
    employeeId: number,
    branchId: number,
    updateEmployeeBranchDto: UpdateEmployeeBranchDto,
  ): Promise<EmployeeBranch> {
    const employeeBranch = await this.findOne(employeeId, branchId);
    Object.assign(employeeBranch, updateEmployeeBranchDto);
    return await this.employeeBranchRepository.save(employeeBranch);
  }

  async remove(employeeId: number, branchId: number): Promise<void> {
    const employeeBranch = await this.findOne(employeeId, branchId);
    await this.employeeBranchRepository.remove(employeeBranch);
  }

  private async ensureEmployeeExists(employeeId: number) {
    const employee = await this.employeeRepository.findOne({
      where: { id: employeeId },
    });
    if (!employee) {
      throw new NotFoundException(`Employee with ID ${employeeId} not found`);
    }
  }

  private async ensureBranchExists(branchId: number) {
    const branch = await this.branchRepository.findOne({
      where: { branch_id: branchId },
    });
    if (!branch) {
      throw new NotFoundException(`Branch with ID ${branchId} not found`);
    }
  }

  private async ensureEmployeeBranchNotExist(
    employeeId: number,
    branchId: number,
  ) {
    const existing = await this.employeeBranchRepository.findOneBy({
      employeeId: employeeId,
      branchId: branchId,
    });
    if (existing) {
      throw new BadRequestException(
        'This employee is already assigned to this branch (record exists).',
      );
    }
  }
}
