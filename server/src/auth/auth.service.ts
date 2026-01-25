import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Employee } from 'src/employee/entities/employee.entity';
import { HrEmployee } from 'src/hr-employee/entities/hr-employee.entity';
import { ProjectManager } from 'src/project-managers/entities/project-manager.entity';
import { Administrator } from 'src/administrator/entities/administrator.entity';
import { EmployeeDepartment } from 'src/employee-department/entities/employee-department.entity';
import { EmployeeBranch } from 'src/employee-branch/entities/employee-branch.entity';
import { Repository } from 'typeorm';
import { CreateUserAuthDto } from './dtos/create-user-auth.dto';
import { VerifyAccountDto } from './dtos/verify-account.dto';
import { AddressesService } from 'src/addresses/addresses.service';
import { CreateAddressDto } from 'src/addresses/dto/create-address.dto';
import { SystemRole } from 'src/common/enum/system-role.enum';

@Injectable()
export class AuthService {
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
    private addressesService: AddressesService,
  ) {}

  private async createRoleRecords(
    userId: number,
    systemRole: SystemRole,
    departmentIds?: number[],
    branchIds?: number[],
  ): Promise<void> {
    const employee = this.employeeRepository.create({
      employedAt: new Date(),
      user: { user_id: userId } as any,
    });
    const savedEmployee = await this.employeeRepository.save(employee);

    // Save employee-department relationships if department IDs are provided
    if (departmentIds && departmentIds.length > 0) {
      const employeeDepartments = departmentIds.map((departmentId) =>
        this.employeeDepartmentRepository.create({
          employeeId: savedEmployee.id,
          departmentId: departmentId,
          startedAt: new Date(),
        }),
      );
      await this.employeeDepartmentRepository.save(employeeDepartments);
    }

    // Save employee-branch relationships if branch IDs are provided
    if (branchIds && branchIds.length > 0) {
      const employeeBranches = branchIds.map((branchId) =>
        this.employeeBranchRepository.create({
          employeeId: savedEmployee.id,
          branchId: branchId,
          startedAt: new Date(),
        }),
      );
      await this.employeeBranchRepository.save(employeeBranches);
    }

    switch (systemRole) {
      case SystemRole.EMPLOYEE:
        break;

      case SystemRole.HR_EMPLOYEE:
        const hrEmployee = this.hrEmployeeRepository.create({
          employee: savedEmployee,
        });
        await this.hrEmployeeRepository.save(hrEmployee);
        break;

      case SystemRole.PROJECT_MANAGER:
        const projectManager = this.projectManagerRepository.create({
          employee: savedEmployee,
        });
        await this.projectManagerRepository.save(projectManager);
        break;

      case SystemRole.ADMIN:
        const adminHrEmployee = this.hrEmployeeRepository.create({
          employee: savedEmployee,
        });
        const savedHrEmployee =
          await this.hrEmployeeRepository.save(adminHrEmployee);

        const adminProjectManager = this.projectManagerRepository.create({
          employee: savedEmployee,
        });
        const savedProjectManager =
          await this.projectManagerRepository.save(adminProjectManager);

        const administrator = this.administratorRepository.create({
          hr_employee_id: savedHrEmployee.id,
          project_manager_id: savedProjectManager.project_manager_id,
        });
        await this.administratorRepository.save(administrator);

        break;
    }
  }

  async emailExists(email: string): Promise<boolean> {
    const user = await this.usersRepository.findOne({
      where: { email },
    });
    return !!user;
  }

  async isActivated(email: string): Promise<boolean> {
    const user = await this.usersRepository.findOne({
      where: { email, isactivated: true },
    });
    return !!user;
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return await this.usersRepository.findOne({
      where: { email },
    });
  }

  async deleteUserByEmail(email: string): Promise<void> {
    const user = await this.usersRepository.findOne({
      where: { email },
    });

    if (user) {
      await this.usersRepository.remove(user);
    }
  }

  async createAccount(
    createUserDto: CreateUserAuthDto,
    verificationToken: string,
  ): Promise<User> {
    // Create address only when all required address fields are present
    const hasAddressData =
      !!createUserDto.country &&
      !!createUserDto.postal_code &&
      !!createUserDto.city &&
      !!createUserDto.street &&
      !!createUserDto.number;

    let addressId: number | null = null;

    if (hasAddressData) {
      const addressData: CreateAddressDto = {
        country: createUserDto.country as string,
        postal_code: createUserDto.postal_code as string,
        city: createUserDto.city as string,
        street: createUserDto.street as string,
        number: createUserDto.number as string,
      };

      if (createUserDto.state) {
        addressData.state = createUserDto.state;
      }

      if (createUserDto.apartment) {
        addressData.apartment = createUserDto.apartment;
      }

      const address = await this.addressesService.create(addressData);
      addressId = address.address_id;
    }

    const newUser = this.usersRepository.create({
      first_name: createUserDto.first_name,
      last_name: createUserDto.last_name,
      email: createUserDto.email,
      gender: createUserDto.gender,
      phone_number: createUserDto.phone_number,
      birthday_date: createUserDto.birthday_date,
      password: '',
      isactivated: false,
      verification_token: verificationToken,
      created_at: new Date(),
      modified_at: new Date(),
      address_id: addressId,
    });
    const savedUser = await this.usersRepository.save(newUser);

    await this.createRoleRecords(
      savedUser.user_id,
      createUserDto.system_role,
      createUserDto.department_ids,
      createUserDto.branch_ids,
    );

    return savedUser;
  }

  async verifyAccount(
    verifyAccountDto: VerifyAccountDto,
    email: string,
  ): Promise<void> {
    const user = await this.usersRepository.findOne({
      where: { email },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // In a real application I would hash the password before saving
    user.password = verifyAccountDto.password;
    user.isactivated = true;
    user.verification_token = null;
    user.modified_at = new Date();

    await this.usersRepository.save(user);
  }
}
