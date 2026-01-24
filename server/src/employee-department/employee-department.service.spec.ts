import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EmployeeDepartmentService } from './employee-department.service';
import { EmployeeDepartment } from './entities/employee-department.entity';
import { Employee } from '../employee/entities/employee.entity';
import { Department } from '../department/entities/department.entity';

describe('EmployeeDepartmentService', () => {
  let service: EmployeeDepartmentService;

  const mockRepository = () => ({
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn(),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmployeeDepartmentService,
        {
          provide: getRepositoryToken(EmployeeDepartment),
          useValue: mockRepository(),
        },
        {
          provide: getRepositoryToken(Employee),
          useValue: mockRepository(),
        },
        {
          provide: getRepositoryToken(Department),
          useValue: mockRepository(),
        },
      ],
    }).compile();

    service = module.get<EmployeeDepartmentService>(EmployeeDepartmentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
