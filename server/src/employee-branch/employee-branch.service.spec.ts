import { Test, TestingModule } from '@nestjs/testing';
import { EmployeeBranchService } from './employee-branch.service';

describe('EmployeeBranchService', () => {
  let service: EmployeeBranchService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmployeeBranchService],
    }).compile();

    service = module.get<EmployeeBranchService>(EmployeeBranchService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
