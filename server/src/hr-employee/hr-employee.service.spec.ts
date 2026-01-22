import { Test, TestingModule } from '@nestjs/testing';
import { HrEmployeeService } from './hr-employee.service';

describe('HrEmployeeService', () => {
  let service: HrEmployeeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HrEmployeeService],
    }).compile();

    service = module.get<HrEmployeeService>(HrEmployeeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
