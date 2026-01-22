import { Test, TestingModule } from '@nestjs/testing';
import { EmployeeBranchController } from './employee-branch.controller';
import { EmployeeBranchService } from './employee-branch.service';

describe('EmployeeBranchController', () => {
  let controller: EmployeeBranchController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmployeeBranchController],
      providers: [EmployeeBranchService],
    }).compile();

    controller = module.get<EmployeeBranchController>(EmployeeBranchController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
