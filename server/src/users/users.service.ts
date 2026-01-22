import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Employee } from '../employee/entities/employee.entity';
import { HrEmployee } from '../hr-employee/entities/hr-employee.entity';
import { ProjectManager } from './entities/project-manager.entity';
import { EmployeeDepartment } from '../employee-department/entities/employee-department.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserProfileDto } from './dto/user-profile.dto';
import { Administrator } from 'src/administrator/entities/administrator.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,
    @InjectRepository(HrEmployee)
    private hrEmployeeRepository: Repository<HrEmployee>,
    @InjectRepository(ProjectManager)
    private projectManagerRepository: Repository<ProjectManager>,
    @InjectRepository(Administrator)
    private administratorRepository: Repository<Administrator>,
    @InjectRepository(EmployeeDepartment)
    private employeeDepartmentRepository: Repository<EmployeeDepartment>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const newUser = this.usersRepository.create({
      ...createUserDto,
      isactivated: false,
      created_at: new Date(),
      modified_at: new Date(),
    });

    return await this.usersRepository.save(newUser);
  }

  async findAll(): Promise<User[]> {
    return await this.usersRepository.find();
  }

  async findOne(id: number): Promise<User> {
    const user = await this.usersRepository.findOneBy({ user_id: id });
    if (!user)
      throw new NotFoundException(`Użytkownik o ID ${id} nie istnieje`);
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    await this.usersRepository.update(id, {
      ...updateUserDto,
      modified_at: new Date(),
    });
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }

  async getUserProfile(id: number): Promise<UserProfileDto> {
    const user = await this.usersRepository.findOne({
      where: { user_id: id },
      relations: ['address'],
    });

    if (!user)
      throw new NotFoundException(`Użytkownik o ID ${id} nie istnieje`);

    let systemRole = 'Employee';
    const departments: string[] = [];

    const employee = await this.employeeRepository.findOne({
      where: { user: { user_id: id } },
      relations: ['user'],
    });

    if (employee) {
      const employeeDepartments = await this.employeeDepartmentRepository.find({
        where: { employeeId: employee.id },
        relations: ['department'],
      });

      if (employeeDepartments.length > 0) {
        const uniqueDepartments = new Set(
          employeeDepartments.map((ed) => ed.department.name),
        );
        departments.push(...uniqueDepartments);
      }
      const hrEmployee = await this.hrEmployeeRepository.findOne({
        where: { employee: { id: employee.id } },
      });

      const projectManager = await this.projectManagerRepository.findOne({
        where: { employee_id: employee.id },
      });

      let isAdmin = false;
      if (hrEmployee) {
        const adminByHr = await this.administratorRepository.findOne({
          where: { hr_employee_id: hrEmployee.id },
        });
        if (adminByHr) isAdmin = true;
      }

      if (projectManager) {
        const adminByPm = await this.administratorRepository.findOne({
          where: { project_manager_id: projectManager.project_manager_id },
        });
        if (adminByPm) isAdmin = true;
      }

      // Determine single system role based on priority
      if (isAdmin) {
        systemRole = 'Admin';
      } else if (projectManager) {
        systemRole = 'Project Manager';
      } else if (hrEmployee) {
        systemRole = 'HR Employee';
      } else {
        systemRole = 'Employee';
      }
    }

    const birthDate = new Date(user.birthday_date);
    return {
      userId: user.user_id,
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
      phoneNumber: user.phone_number,
      birthYear: birthDate.getUTCFullYear(),
      birthMonth: birthDate.getUTCMonth() + 1,
      birthDay: birthDate.getUTCDate(),
      addressCountry: user.address?.country || '',
      addressState: user.address?.state || '',
      addressPostalCode: user.address?.postal_code || '',
      addressCity: user.address?.city || '',
      addressStreet: user.address?.street || '',
      addressNumber: user.address?.number || '',
      addressApartment: user.address?.apartment || '',
      employeeSince: user.created_at.toISOString().split('T')[0],
      lastModification: user.modified_at.toISOString().split('T')[0],
      branches: [],
      departments: departments,
      systemRole: systemRole,
    };
  }
}
