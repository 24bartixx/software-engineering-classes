import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Employee } from 'src/users/entities/employee.entity';
import { HrEmployee } from 'src/users/entities/hr-employee.entity';
import { ProjectManager } from 'src/users/entities/project-manager.entity';
import { Administrator } from 'src/users/entities/administrator.entity';
import { EmployeeDepartment } from 'src/employee-department/entities/employee-department.entity';
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
    private addressesService: AddressesService,
  ) {}

  private async createRoleRecords(
    userId: number,
    systemRole: SystemRole,
    departmentIds?: number[],
  ): Promise<void> {
    const employee = this.employeeRepository.create({
      employed_at: new Date(),
      user_id: userId,
    });
    const savedEmployee = await this.employeeRepository.save(employee);

    // Save employee-department relationships if department IDs are provided
    if (departmentIds && departmentIds.length > 0) {
      const employeeDepartments = departmentIds.map((departmentId) =>
        this.employeeDepartmentRepository.create({
          employeeId: savedEmployee.employee_id,
          departmentId: departmentId,
          startedAt: new Date(),
        }),
      );
      await this.employeeDepartmentRepository.save(employeeDepartments);
    }

    switch (systemRole) {
      case SystemRole.EMPLOYEE:
        break;

      case SystemRole.HR_EMPLOYEE:
        const hrEmployee = this.hrEmployeeRepository.create({
          employee_id: savedEmployee.employee_id,
        });
        await this.hrEmployeeRepository.save(hrEmployee);
        break;

      case SystemRole.PROJECT_MANAGER:
        const projectManager = this.projectManagerRepository.create({
          employee_id: savedEmployee.employee_id,
        });
        await this.projectManagerRepository.save(projectManager);
        break;

      case SystemRole.ADMIN:
        const adminHrEmployee = this.hrEmployeeRepository.create({
          employee_id: savedEmployee.employee_id,
        });
        const savedHrEmployee =
          await this.hrEmployeeRepository.save(adminHrEmployee);

        const adminProjectManager = this.projectManagerRepository.create({
          employee_id: savedEmployee.employee_id,
        });
        const savedProjectManager =
          await this.projectManagerRepository.save(adminProjectManager);

        const administrator = this.administratorRepository.create({
          hr_employee_id: savedHrEmployee.hr_employee_id,
          project_manager_id: savedProjectManager.project_manager_id,
        });
        await this.administratorRepository.save(administrator);

        break;
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
