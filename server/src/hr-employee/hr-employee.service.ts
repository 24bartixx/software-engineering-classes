import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HrEmployee } from './entities/hr-employee.entity';
import { Repository } from 'typeorm';
import { CreateHrEmployeeDto } from './dto/create-hr-employee.dto';
import { UpdateHrEmployeeDto } from './dto/update-hr-employee.dto';
import { Employee } from 'src/employee/entities/employee.entity';

@Injectable()
export class HrEmployeeService {
  constructor(
    @InjectRepository(HrEmployee)
    private readonly hrEmployeeRepository: Repository<HrEmployee>,
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
  ) {}

  async create(createHrEmployeeDto: CreateHrEmployeeDto): Promise<HrEmployee> {
    const employee = await this.ensureEmployeeExists(
      createHrEmployeeDto.employeeId,
    );
    await this.ensureEmployeeIsNotHrEmployee(createHrEmployeeDto.employeeId);
    const hrEmployee = this.hrEmployeeRepository.create({
      employee: employee,
    });
    return await this.hrEmployeeRepository.save(hrEmployee);
  }

  async findAll(): Promise<HrEmployee[]> {
    return await this.hrEmployeeRepository.find({
      relations: ['employee', 'employee.user'],
    });
  }

  async findOne(id: number): Promise<HrEmployee> {
    const hrEmployee = await this.hrEmployeeRepository.findOne({
      where: { id: id },
      relations: ['employee', 'employee.user'],
    });
    if (!hrEmployee) {
      throw new NotFoundException(`HR Employee with ID ${id} not found`);
    }
    return hrEmployee;
  }

  async update(
    id: number,
    updateHrEmployeeDto: UpdateHrEmployeeDto,
  ): Promise<HrEmployee> {
    const hrEmployee = await this.findOne(id);
    if (updateHrEmployeeDto.employeeId) {
      const employee = await this.ensureEmployeeExists(
        updateHrEmployeeDto.employeeId,
      );
      if (hrEmployee.employee.id !== updateHrEmployeeDto.employeeId) {
        await this.ensureEmployeeIsNotHrEmployee(
          updateHrEmployeeDto.employeeId,
        );
      }
      hrEmployee.employee = employee;
    }
    return await this.hrEmployeeRepository.save(hrEmployee);
  }

  async remove(id: number): Promise<void> {
    const hrEmployee = await this.findOne(id);
    await this.hrEmployeeRepository.remove(hrEmployee);
  }

  private async ensureEmployeeExists(employeeId: number): Promise<Employee> {
    const employee = await this.employeeRepository.findOneBy({
      id: employeeId,
    });
    if (!employee) {
      throw new NotFoundException(`Employee with ID ${employeeId} not found`);
    }
    return employee;
  }

  private async ensureEmployeeIsNotHrEmployee(
    employeeId: number,
  ): Promise<void> {
    const existingHrEmployee = await this.hrEmployeeRepository.findOneBy({
      employee: { id: employeeId },
    });
    if (existingHrEmployee) {
      throw new BadRequestException(
        `Employee with ID ${employeeId} is already an HR employee`,
      );
    }
  }
}
