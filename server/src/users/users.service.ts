import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Employee } from '../employee/entities/employee.entity';
import { HrEmployee } from '../hr-employee/entities/hr-employee.entity';
import { EmployeeDepartment } from '../employee-department/entities/employee-department.entity';
import { EmployeeBranch } from '../employee-branch/entities/employee-branch.entity';
import { Address } from 'src/addresses/entities/address.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserProfileDto } from './dto/user-profile.dto';
import { Administrator } from 'src/administrator/entities/administrator.entity';
import { ProjectManager } from 'src/project-managers/entities/project-manager.entity';
import { CreateUserAddressDto } from './dto/create-user-address.dto';

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
    @InjectRepository(EmployeeBranch)
    private employeeBranchRepository: Repository<EmployeeBranch>,
    @InjectRepository(Address)
    private addressRepository: Repository<Address>,
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
    const branches: string[] = [];

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

      const employeeBranches = await this.employeeBranchRepository.find({
        where: { employeeId: employee.id },
        relations: ['branch', 'branch.address'],
      });

      if (employeeBranches.length > 0) {
        const uniqueBranches = new Set(
          employeeBranches.map(
            (eb) => eb.branch.address?.city || `Branch #${eb.branch.branch_id}`,
          ),
        );
        branches.push(...uniqueBranches);
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
      gender: user.gender,
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
      branches: branches,
      departments: departments,
      systemRole: systemRole,
    };
  }

  async editUser(userId: number, editUserDto: any): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { user_id: userId },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Update basic user fields
    user.first_name = editUserDto.first_name;
    user.last_name = editUserDto.last_name;
    user.email = editUserDto.email;
    user.gender = editUserDto.gender;
    user.phone_number = editUserDto.phone_number;
    user.birthday_date = editUserDto.birthday_date;
    user.modified_at = new Date();

    const savedUser = await this.usersRepository.save(user);

    // Find employee record
    const employee = await this.employeeRepository.findOne({
      where: { user: { user_id: userId } },
    });

    if (employee) {
      // Handle departments: remove all existing and add new ones
      await this.employeeDepartmentRepository.delete({
        employeeId: employee.id,
      });

      if (editUserDto.department_ids && editUserDto.department_ids.length > 0) {
        const employeeDepartments = editUserDto.department_ids.map(
          (departmentId: number) =>
            this.employeeDepartmentRepository.create({
              employeeId: employee.id,
              departmentId: departmentId,
              startedAt: new Date(),
            }),
        );
        await this.employeeDepartmentRepository.save(employeeDepartments);
      }

      // Handle branches: remove all existing and add new ones
      await this.employeeBranchRepository.delete({
        employeeId: employee.id,
      });

      if (editUserDto.branch_ids && editUserDto.branch_ids.length > 0) {
        const employeeBranches = editUserDto.branch_ids.map(
          (branchId: number) =>
            this.employeeBranchRepository.create({
              employeeId: employee.id,
              branchId: branchId,
              startedAt: new Date(),
            }),
        );
        await this.employeeBranchRepository.save(employeeBranches);
      }

      // TODO: Handle system role changes
      // This is complex because we need to:
      // 1. Check current role (Employee, HR_EMPLOYEE, PROJECT_MANAGER, ADMIN)
      // 2. Remove old role records (hr_employee, project_manager, administrator)
      // 3. Create new role records based on editUserDto.system_role
      // 4. Ensure data integrity across related tables
    }

    return savedUser;
  }

  async getAddress(userId: number): Promise<Address | null> {
    const user = await this.usersRepository.findOne({
      where: { user_id: userId },
      relations: ['address'],
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    return user.address || null;
  }

  async removeAddress(userId: number): Promise<void> {
    const user = await this.usersRepository.findOne({
      where: { user_id: userId },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const addressId = user.address_id;

    // Set user's address_id to null using update to ensure it's persisted
    await this.usersRepository.update(userId, {
      address_id: null,
      modified_at: new Date(),
    });

    // Try to remove the address if it exists
    if (addressId) {
      try {
        await this.addressRepository.delete(addressId);
      } catch (error) {
        // If deletion fails (e.g., other users reference it), that's okay
        // The address_id is already set to null for this user
      }
    }
  }

  async createAddress(
    userId: number,
    createUserAddressDto: CreateUserAddressDto,
  ): Promise<Address> {
    const user = await this.usersRepository.findOne({
      where: { user_id: userId },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Create the new address
    const address = this.addressRepository.create(createUserAddressDto);
    const savedAddress = await this.addressRepository.save(address);

    // Assign the address to the user
    await this.usersRepository.update(userId, {
      address_id: savedAddress.address_id,
      modified_at: new Date(),
    });

    return savedAddress;
  }
}
