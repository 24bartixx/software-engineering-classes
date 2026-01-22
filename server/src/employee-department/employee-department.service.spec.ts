import { Test, TestingModule } from '@nestjs/testing';
import { EmployeeDepartmentService } from './employee-department.service';

describe('EmployeeDepartmentService', () => {
  let service: EmployeeDepartmentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmployeeDepartmentService],
    }).compile();

    service = module.get<EmployeeDepartmentService>(EmployeeDepartmentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
