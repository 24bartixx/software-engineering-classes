import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { Employee } from '../employee/entities/employee.entity';
import { HrEmployee } from '../hr-employee/entities/hr-employee.entity';
import { ProjectManager } from '../project-managers/entities/project-manager.entity';
import { Administrator } from '../administrator/entities/administrator.entity';
import { EmployeeDepartment } from '../employee-department/entities/employee-department.entity';
import { EmployeeBranch } from '../employee-branch/entities/employee-branch.entity';
import { Address } from '../addresses/entities/address.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserAddressDto } from './dto/create-user-address.dto';
import { Gender } from '../common/enum/gender.enum';

describe('UsersService', () => {
  let service: UsersService;
  let usersRepository: jest.Mocked<Repository<User>>;
  let employeeRepository: jest.Mocked<Repository<Employee>>;
  let hrEmployeeRepository: jest.Mocked<Repository<HrEmployee>>;
  let projectManagerRepository: jest.Mocked<Repository<ProjectManager>>;
  let administratorRepository: jest.Mocked<Repository<Administrator>>;
  let employeeDepartmentRepository: jest.Mocked<Repository<EmployeeDepartment>>;
  let employeeBranchRepository: jest.Mocked<Repository<EmployeeBranch>>;
  let addressRepository: jest.Mocked<Repository<Address>>;

  const mockRepository = () => ({
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    findOneBy: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository(),
        },
        {
          provide: getRepositoryToken(Employee),
          useValue: mockRepository(),
        },
        {
          provide: getRepositoryToken(HrEmployee),
          useValue: mockRepository(),
        },
        {
          provide: getRepositoryToken(ProjectManager),
          useValue: mockRepository(),
        },
        {
          provide: getRepositoryToken(Administrator),
          useValue: mockRepository(),
        },
        {
          provide: getRepositoryToken(EmployeeDepartment),
          useValue: mockRepository(),
        },
        {
          provide: getRepositoryToken(EmployeeBranch),
          useValue: mockRepository(),
        },
        {
          provide: getRepositoryToken(Address),
          useValue: mockRepository(),
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    usersRepository = module.get(getRepositoryToken(User));
    employeeRepository = module.get(getRepositoryToken(Employee));
    hrEmployeeRepository = module.get(getRepositoryToken(HrEmployee));
    projectManagerRepository = module.get(getRepositoryToken(ProjectManager));
    administratorRepository = module.get(getRepositoryToken(Administrator));
    employeeDepartmentRepository = module.get(
      getRepositoryToken(EmployeeDepartment),
    );
    employeeBranchRepository = module.get(getRepositoryToken(EmployeeBranch));
    addressRepository = module.get(getRepositoryToken(Address));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should successfully create a new user', async () => {
      const createUserDto: CreateUserDto = {
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@example.com',
        password: 'password123',
        gender: Gender.Male,
        phone_number: '+48123456789',
        birthday_date: '1990-01-01',
        address_id: 1,
      };

      const expectedUser = {
        user_id: 1,
        ...createUserDto,
        isactivated: false,
        created_at: expect.any(Date),
        modified_at: expect.any(Date),
      };

      usersRepository.create.mockReturnValue(expectedUser as any);
      usersRepository.save.mockResolvedValue(expectedUser as any);

      const result = await service.create(createUserDto);

      expect(usersRepository.create).toHaveBeenCalledWith({
        ...createUserDto,
        isactivated: false,
        created_at: expect.any(Date),
        modified_at: expect.any(Date),
      });
      expect(usersRepository.save).toHaveBeenCalledWith(expectedUser);
      expect(result).toEqual(expectedUser);
    });

    it('should create user without optional address_id', async () => {
      const createUserDto: CreateUserDto = {
        first_name: 'Jane',
        last_name: 'Smith',
        email: 'jane.smith@example.com',
        password: 'password456',
        gender: Gender.Female,
        phone_number: '+48987654321',
        birthday_date: '1995-05-15',
      };

      const expectedUser = {
        user_id: 2,
        ...createUserDto,
        isactivated: false,
        created_at: expect.any(Date),
        modified_at: expect.any(Date),
      };

      usersRepository.create.mockReturnValue(expectedUser as any);
      usersRepository.save.mockResolvedValue(expectedUser as any);

      const result = await service.create(createUserDto);

      expect(result).toEqual(expectedUser);
      expect(result.address_id).toBeUndefined();
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const users = [
        { user_id: 1, first_name: 'John', email: 'john@example.com' },
        { user_id: 2, first_name: 'Jane', email: 'jane@example.com' },
      ];

      usersRepository.find.mockResolvedValue(users as any);

      const result = await service.findAll();

      expect(usersRepository.find).toHaveBeenCalled();
      expect(result).toEqual(users);
      expect(result).toHaveLength(2);
    });

    it('should return an empty array when no users exist', async () => {
      usersRepository.find.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });
  });

  describe('findOne', () => {
    it('should return a user when found', async () => {
      const user = {
        user_id: 1,
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@example.com',
      };

      usersRepository.findOneBy.mockResolvedValue(user as any);

      const result = await service.findOne(1);

      expect(usersRepository.findOneBy).toHaveBeenCalledWith({ user_id: 1 });
      expect(result).toEqual(user);
    });

    it('should throw NotFoundException when user does not exist', async () => {
      usersRepository.findOneBy.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
      await expect(service.findOne(999)).rejects.toThrow(
        'Użytkownik o ID 999 nie istnieje',
      );
    });

    it('should throw NotFoundException for negative ID', async () => {
      usersRepository.findOneBy.mockResolvedValue(null);

      await expect(service.findOne(-1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should successfully update a user', async () => {
      const updateUserDto: UpdateUserDto = {
        first_name: 'John Updated',
        email: 'john.updated@example.com',
      };

      const existingUser = {
        user_id: 1,
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@example.com',
      };

      const updatedUser = {
        ...existingUser,
        ...updateUserDto,
        modified_at: expect.any(Date),
      };

      usersRepository.update.mockResolvedValue({ affected: 1 } as any);
      usersRepository.findOneBy.mockResolvedValue(updatedUser as any);

      const result = await service.update(1, updateUserDto);

      expect(usersRepository.update).toHaveBeenCalledWith(1, {
        ...updateUserDto,
        modified_at: expect.any(Date),
      });
      expect(result).toEqual(updatedUser);
    });

    it('should throw NotFoundException when updating non-existent user', async () => {
      const updateUserDto: UpdateUserDto = {
        first_name: 'John Updated',
      };

      usersRepository.update.mockResolvedValue({ affected: 1 } as any);
      usersRepository.findOneBy.mockResolvedValue(null);

      await expect(service.update(999, updateUserDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should update only provided fields', async () => {
      const updateUserDto: UpdateUserDto = {
        phone_number: '+48111222333',
      };

      const existingUser = {
        user_id: 1,
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@example.com',
        phone_number: '+48111222333',
      };

      usersRepository.update.mockResolvedValue({ affected: 1 } as any);
      usersRepository.findOneBy.mockResolvedValue(existingUser as any);

      const result = await service.update(1, updateUserDto);

      expect(result.first_name).toBe('John');
      expect(result.phone_number).toBe('+48111222333');
    });
  });

  describe('remove', () => {
    it('should successfully delete a user', async () => {
      usersRepository.delete.mockResolvedValue({ affected: 1 } as any);

      await service.remove(1);

      expect(usersRepository.delete).toHaveBeenCalledWith(1);
    });

    it('should not throw error when deleting non-existent user', async () => {
      usersRepository.delete.mockResolvedValue({ affected: 0 } as any);

      await expect(service.remove(999)).resolves.toBeUndefined();
    });
  });

  describe('getUserProfile', () => {
    it('should return user profile for regular employee', async () => {
      const user = {
        user_id: 1,
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@example.com',
        phone_number: '+48123456789',
        gender: Gender.Male,
        birthday_date: '1990-01-15',
        created_at: new Date('2020-01-01'),
        modified_at: new Date('2023-01-01'),
        address: {
          country: 'Poland',
          state: 'Mazowieckie',
          postal_code: '00-001',
          city: 'Warsaw',
          street: 'Main Street',
          number: '1',
          apartment: '10',
        },
      };

      const employee = { id: 1, user: { user_id: 1 } };

      usersRepository.findOne.mockResolvedValue(user as any);
      employeeRepository.findOne.mockResolvedValue(employee as any);
      employeeDepartmentRepository.find.mockResolvedValue([
        { department: { name: 'IT' } },
        { department: { name: 'Marketing' } },
      ] as any);
      employeeBranchRepository.find.mockResolvedValue([
        { branch: { branch_id: 1, address: { city: 'Warsaw' } } },
      ] as any);
      hrEmployeeRepository.findOne.mockResolvedValue(null);
      projectManagerRepository.findOne.mockResolvedValue(null);

      const result = await service.getUserProfile(1);

      expect(result).toEqual({
        userId: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phoneNumber: '+48123456789',
        gender: Gender.Male,
        birthYear: 1990,
        birthMonth: 1,
        birthDay: 15,
        addressCountry: 'Poland',
        addressState: 'Mazowieckie',
        addressPostalCode: '00-001',
        addressCity: 'Warsaw',
        addressStreet: 'Main Street',
        addressNumber: '1',
        addressApartment: '10',
        employeeSince: '2020-01-01',
        lastModification: '2023-01-01',
        branches: ['Warsaw'],
        departments: ['IT', 'Marketing'],
        systemRole: 'Employee',
      });
    });

    it('should return user profile with HR Employee role', async () => {
      const user = {
        user_id: 2,
        first_name: 'Jane',
        last_name: 'Smith',
        email: 'jane@example.com',
        phone_number: '+48987654321',
        gender: Gender.Male,
        birthday_date: '1985-06-20',
        created_at: new Date('2019-01-01'),
        modified_at: new Date('2023-06-01'),
        address: null,
      };

      const employee = { id: 2, user: { user_id: 2 } };
      const hrEmployee = { id: 1, employee: { id: 2 } };

      usersRepository.findOne.mockResolvedValue(user as any);
      employeeRepository.findOne.mockResolvedValue(employee as any);
      employeeDepartmentRepository.find.mockResolvedValue([]);
      employeeBranchRepository.find.mockResolvedValue([]);
      hrEmployeeRepository.findOne.mockResolvedValue(hrEmployee as any);
      projectManagerRepository.findOne.mockResolvedValue(null);
      administratorRepository.findOne.mockResolvedValue(null);

      const result = await service.getUserProfile(2);

      expect(result.systemRole).toBe('HR Employee');
      expect(result.addressCountry).toBe('');
      expect(result.departments).toEqual([]);
      expect(result.branches).toEqual([]);
    });

    it('should return user profile with Project Manager role', async () => {
      const user = {
        user_id: 3,
        first_name: 'Bob',
        last_name: 'Manager',
        email: 'bob@example.com',
        phone_number: '+48111222333',
        gender: Gender.Male,
        birthday_date: '1980-03-10',
        created_at: new Date('2018-01-01'),
        modified_at: new Date('2023-03-01'),
        address: null,
      };

      const employee = { id: 3, user: { user_id: 3 } };
      const projectManager = { project_manager_id: 1, employee_id: 3 };

      usersRepository.findOne.mockResolvedValue(user as any);
      employeeRepository.findOne.mockResolvedValue(employee as any);
      employeeDepartmentRepository.find.mockResolvedValue([]);
      employeeBranchRepository.find.mockResolvedValue([]);
      hrEmployeeRepository.findOne.mockResolvedValue(null);
      projectManagerRepository.findOne.mockResolvedValue(projectManager as any);
      administratorRepository.findOne.mockResolvedValue(null);

      const result = await service.getUserProfile(3);

      expect(result.systemRole).toBe('Project Manager');
    });

    it('should return user profile with Admin role', async () => {
      const user = {
        user_id: 4,
        first_name: 'Admin',
        last_name: 'User',
        email: 'admin@example.com',
        phone_number: '+48444555666',
        gender: Gender.Female,
        birthday_date: '1975-12-25',
        created_at: new Date('2015-01-01'),
        modified_at: new Date('2023-12-01'),
        address: null,
      };

      const employee = { id: 4, user: { user_id: 4 } };
      const hrEmployee = { id: 2, employee: { id: 4 } };
      const administrator = { administrator_id: 1, hr_employee_id: 2 };

      usersRepository.findOne.mockResolvedValue(user as any);
      employeeRepository.findOne.mockResolvedValue(employee as any);
      employeeDepartmentRepository.find.mockResolvedValue([]);
      employeeBranchRepository.find.mockResolvedValue([]);
      hrEmployeeRepository.findOne.mockResolvedValue(hrEmployee as any);
      projectManagerRepository.findOne.mockResolvedValue(null);
      administratorRepository.findOne.mockResolvedValue(administrator as any);

      const result = await service.getUserProfile(4);

      expect(result.systemRole).toBe('Admin');
    });

    it('should throw NotFoundException when user does not exist', async () => {
      usersRepository.findOne.mockResolvedValue(null);

      await expect(service.getUserProfile(999)).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.getUserProfile(999)).rejects.toThrow(
        'Użytkownik o ID 999 nie istnieje',
      );
    });

    it('should handle user without employee record', async () => {
      const user = {
        user_id: 5,
        first_name: 'New',
        last_name: 'User',
        email: 'new@example.com',
        phone_number: '+48777888999',
        gender: Gender.Other,
        birthday_date: '2000-01-01',
        created_at: new Date('2024-01-01'),
        modified_at: new Date('2024-01-01'),
        address: null,
      };

      usersRepository.findOne.mockResolvedValue(user as any);
      employeeRepository.findOne.mockResolvedValue(null);

      const result = await service.getUserProfile(5);

      expect(result.systemRole).toBe('Employee');
      expect(result.departments).toEqual([]);
      expect(result.branches).toEqual([]);
    });

    it('should handle branch without address', async () => {
      const user = {
        user_id: 6,
        first_name: 'Test',
        last_name: 'User',
        email: 'test@example.com',
        phone_number: '+48000111222',
        gender: Gender.Male,
        birthday_date: '1992-08-15',
        created_at: new Date('2021-01-01'),
        modified_at: new Date('2023-08-01'),
        address: null,
      };

      const employee = { id: 6, user: { user_id: 6 } };

      usersRepository.findOne.mockResolvedValue(user as any);
      employeeRepository.findOne.mockResolvedValue(employee as any);
      employeeDepartmentRepository.find.mockResolvedValue([]);
      employeeBranchRepository.find.mockResolvedValue([
        { branch: { branch_id: 5, address: null } },
      ] as any);
      hrEmployeeRepository.findOne.mockResolvedValue(null);
      projectManagerRepository.findOne.mockResolvedValue(null);

      const result = await service.getUserProfile(6);

      expect(result.branches).toEqual(['Branch #5']);
    });

    it('should deduplicate departments and branches', async () => {
      const user = {
        user_id: 7,
        first_name: 'Duplicate',
        last_name: 'Test',
        email: 'dup@example.com',
        phone_number: '+48333444555',
        gender: Gender.Female,
        birthday_date: '1988-04-10',
        created_at: new Date('2017-01-01'),
        modified_at: new Date('2023-04-01'),
        address: null,
      };

      const employee = { id: 7, user: { user_id: 7 } };

      usersRepository.findOne.mockResolvedValue(user as any);
      employeeRepository.findOne.mockResolvedValue(employee as any);
      employeeDepartmentRepository.find.mockResolvedValue([
        { department: { name: 'IT' } },
        { department: { name: 'IT' } },
        { department: { name: 'HR' } },
      ] as any);
      employeeBranchRepository.find.mockResolvedValue([
        { branch: { branch_id: 1, address: { city: 'Warsaw' } } },
        { branch: { branch_id: 2, address: { city: 'Warsaw' } } },
        { branch: { branch_id: 3, address: { city: 'Krakow' } } },
      ] as any);
      hrEmployeeRepository.findOne.mockResolvedValue(null);
      projectManagerRepository.findOne.mockResolvedValue(null);

      const result = await service.getUserProfile(7);

      expect(result.departments).toEqual(['IT', 'HR']);
      expect(result.branches).toEqual(['Warsaw', 'Krakow']);
    });
  });

  describe('editUser', () => {
    it('should successfully edit user with departments and branches', async () => {
      const editUserDto = {
        first_name: 'Updated',
        last_name: 'Name',
        email: 'updated@example.com',
        gender: Gender.Male,
        phone_number: '+48999888777',
        birthday_date: '1991-11-11',
        department_ids: [1, 2],
        branch_ids: [1],
      };

      const user = {
        user_id: 1,
        first_name: 'Old',
        last_name: 'Name',
        email: 'old@example.com',
      };

      const employee = { id: 1, user: { user_id: 1 } };

      usersRepository.findOne.mockResolvedValue(user as any);
      usersRepository.save.mockResolvedValue({
        ...user,
        ...editUserDto,
      } as any);
      employeeRepository.findOne.mockResolvedValue(employee as any);
      employeeDepartmentRepository.delete.mockResolvedValue({
        affected: 1,
      } as any);
      employeeDepartmentRepository.create.mockImplementation(
        (data) => data as any,
      );
      employeeDepartmentRepository.save.mockResolvedValue([] as any);
      employeeBranchRepository.delete.mockResolvedValue({ affected: 1 } as any);
      employeeBranchRepository.create.mockImplementation((data) => data as any);
      employeeBranchRepository.save.mockResolvedValue([] as any);

      const result = await service.editUser(1, editUserDto);

      expect(usersRepository.findOne).toHaveBeenCalledWith({
        where: { user_id: 1 },
      });
      expect(usersRepository.save).toHaveBeenCalled();
      expect(employeeDepartmentRepository.delete).toHaveBeenCalledWith({
        employeeId: 1,
      });
      expect(employeeBranchRepository.delete).toHaveBeenCalledWith({
        employeeId: 1,
      });
      expect(result.first_name).toBe('Updated');
    });

    it('should throw NotFoundException when editing non-existent user', async () => {
      const editUserDto = {
        first_name: 'Test',
        last_name: 'User',
        email: 'test@example.com',
        gender: Gender.Male,
        phone_number: '+48123456789',
        birthday_date: '1990-01-01',
      };

      usersRepository.findOne.mockResolvedValue(null);

      await expect(service.editUser(999, editUserDto)).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.editUser(999, editUserDto)).rejects.toThrow(
        'User with ID 999 not found',
      );
    });

    it('should edit user without employee record', async () => {
      const editUserDto = {
        first_name: 'Simple',
        last_name: 'Edit',
        email: 'simple@example.com',
        gender: Gender.Female,
        phone_number: '+48555666777',
        birthday_date: '1995-05-05',
      };

      const user = {
        user_id: 2,
        first_name: 'Old',
        last_name: 'Value',
        email: 'old@example.com',
      };

      usersRepository.findOne.mockResolvedValue(user as any);
      usersRepository.save.mockResolvedValue({
        ...user,
        ...editUserDto,
      } as any);
      employeeRepository.findOne.mockResolvedValue(null);

      const result = await service.editUser(2, editUserDto);

      expect(result.first_name).toBe('Simple');
      expect(employeeDepartmentRepository.delete).not.toHaveBeenCalled();
    });

    it('should handle empty department and branch arrays', async () => {
      const editUserDto = {
        first_name: 'Empty',
        last_name: 'Arrays',
        email: 'empty@example.com',
        gender: Gender.Other,
        phone_number: '+48444333222',
        birthday_date: '1993-03-03',
        department_ids: [],
        branch_ids: [],
      };

      const user = { user_id: 3, first_name: 'Test' };
      const employee = { id: 3, user: { user_id: 3 } };

      usersRepository.findOne.mockResolvedValue(user as any);
      usersRepository.save.mockResolvedValue({
        ...user,
        ...editUserDto,
      } as any);
      employeeRepository.findOne.mockResolvedValue(employee as any);
      employeeDepartmentRepository.delete.mockResolvedValue({
        affected: 0,
      } as any);
      employeeBranchRepository.delete.mockResolvedValue({ affected: 0 } as any);

      const result = await service.editUser(3, editUserDto);

      expect(employeeDepartmentRepository.save).not.toHaveBeenCalled();
      expect(employeeBranchRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('getAddress', () => {
    it('should return address when user has one', async () => {
      const address = {
        address_id: 1,
        country: 'Poland',
        city: 'Warsaw',
        street: 'Main St',
        number: '1',
      };

      const user = {
        user_id: 1,
        first_name: 'John',
        address: address,
      };

      usersRepository.findOne.mockResolvedValue(user as any);

      const result = await service.getAddress(1);

      expect(usersRepository.findOne).toHaveBeenCalledWith({
        where: { user_id: 1 },
        relations: ['address'],
      });
      expect(result).toEqual(address);
    });

    it('should return null when user has no address', async () => {
      const user = {
        user_id: 2,
        first_name: 'Jane',
        address: null,
      };

      usersRepository.findOne.mockResolvedValue(user as any);

      const result = await service.getAddress(2);

      expect(result).toBeNull();
    });

    it('should throw NotFoundException when user does not exist', async () => {
      usersRepository.findOne.mockResolvedValue(null);

      await expect(service.getAddress(999)).rejects.toThrow(NotFoundException);
      await expect(service.getAddress(999)).rejects.toThrow(
        'User with ID 999 not found',
      );
    });
  });

  describe('removeAddress', () => {
    it('should successfully remove address from user', async () => {
      const user = {
        user_id: 1,
        first_name: 'John',
        address_id: 5,
      };

      usersRepository.findOne.mockResolvedValue(user as any);
      usersRepository.update.mockResolvedValue({ affected: 1 } as any);
      addressRepository.delete.mockResolvedValue({ affected: 1 } as any);

      await service.removeAddress(1);

      expect(usersRepository.update).toHaveBeenCalledWith(1, {
        address_id: null,
        modified_at: expect.any(Date),
      });
      expect(addressRepository.delete).toHaveBeenCalledWith(5);
    });

    it('should handle user with no address_id', async () => {
      const user = {
        user_id: 2,
        first_name: 'Jane',
        address_id: null,
      };

      usersRepository.findOne.mockResolvedValue(user as any);
      usersRepository.update.mockResolvedValue({ affected: 1 } as any);

      await service.removeAddress(2);

      expect(usersRepository.update).toHaveBeenCalled();
      expect(addressRepository.delete).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException when user does not exist', async () => {
      usersRepository.findOne.mockResolvedValue(null);

      await expect(service.removeAddress(999)).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.removeAddress(999)).rejects.toThrow(
        'User with ID 999 not found',
      );
    });

    it('should handle address deletion error gracefully', async () => {
      const user = {
        user_id: 3,
        first_name: 'Bob',
        address_id: 10,
      };

      usersRepository.findOne.mockResolvedValue(user as any);
      usersRepository.update.mockResolvedValue({ affected: 1 } as any);
      addressRepository.delete.mockRejectedValue(new Error('Delete failed'));

      await expect(service.removeAddress(3)).resolves.toBeUndefined();
      expect(usersRepository.update).toHaveBeenCalled();
    });
  });

  describe('createAddress', () => {
    it('should successfully create and assign address to user', async () => {
      const createAddressDto: CreateUserAddressDto = {
        country: 'Poland',
        state: 'Mazowieckie',
        postal_code: '00-001',
        city: 'Warsaw',
        street: 'Main Street',
        number: '1',
        apartment: '10',
      };

      const user = {
        user_id: 1,
        first_name: 'John',
      };

      const savedAddress = {
        address_id: 1,
        ...createAddressDto,
      };

      usersRepository.findOne.mockResolvedValue(user as any);
      addressRepository.create.mockReturnValue(savedAddress as any);
      addressRepository.save.mockResolvedValue(savedAddress as any);
      usersRepository.update.mockResolvedValue({ affected: 1 } as any);

      const result = await service.createAddress(1, createAddressDto);

      expect(addressRepository.create).toHaveBeenCalledWith(createAddressDto);
      expect(addressRepository.save).toHaveBeenCalledWith(savedAddress);
      expect(usersRepository.update).toHaveBeenCalledWith(1, {
        address_id: 1,
        modified_at: expect.any(Date),
      });
      expect(result).toEqual(savedAddress);
    });

    it('should create address without optional fields', async () => {
      const createAddressDto: CreateUserAddressDto = {
        country: 'USA',
        postal_code: '10001',
        city: 'New York',
        street: 'Broadway',
        number: '100',
      };

      const user = { user_id: 2, first_name: 'Jane' };
      const savedAddress = { address_id: 2, ...createAddressDto };

      usersRepository.findOne.mockResolvedValue(user as any);
      addressRepository.create.mockReturnValue(savedAddress as any);
      addressRepository.save.mockResolvedValue(savedAddress as any);
      usersRepository.update.mockResolvedValue({ affected: 1 } as any);

      const result = await service.createAddress(2, createAddressDto);

      expect(result.state).toBeUndefined();
      expect(result.apartment).toBeUndefined();
      expect(result.country).toBe('USA');
    });

    it('should throw NotFoundException when user does not exist', async () => {
      const createAddressDto: CreateUserAddressDto = {
        country: 'Poland',
        postal_code: '00-001',
        city: 'Warsaw',
        street: 'Test',
        number: '1',
      };

      usersRepository.findOne.mockResolvedValue(null);

      await expect(
        service.createAddress(999, createAddressDto),
      ).rejects.toThrow(NotFoundException);
      await expect(
        service.createAddress(999, createAddressDto),
      ).rejects.toThrow('User with ID 999 not found');
    });

    it('should handle address creation for user with existing address', async () => {
      const createAddressDto: CreateUserAddressDto = {
        country: 'Germany',
        postal_code: '10115',
        city: 'Berlin',
        street: 'Unter den Linden',
        number: '5',
      };

      const user = {
        user_id: 3,
        first_name: 'Bob',
        address_id: 99, // User already has an address
      };

      const savedAddress = {
        address_id: 100,
        ...createAddressDto,
      };

      usersRepository.findOne.mockResolvedValue(user as any);
      addressRepository.create.mockReturnValue(savedAddress as any);
      addressRepository.save.mockResolvedValue(savedAddress as any);
      usersRepository.update.mockResolvedValue({ affected: 1 } as any);

      const result = await service.createAddress(3, createAddressDto);

      expect(usersRepository.update).toHaveBeenCalledWith(3, {
        address_id: 100,
        modified_at: expect.any(Date),
      });
      expect(result).toEqual(savedAddress);
    });
  });
});
