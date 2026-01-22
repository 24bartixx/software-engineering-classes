import { Test, TestingModule } from '@nestjs/testing';
import { EmployeeDepartmentController } from './employee-department.controller';

describe('EmployeeDepartmentController', () => {
  let controller: EmployeeDepartmentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmployeeDepartmentController],
    }).compile();

    controller = module.get<EmployeeDepartmentController>(EmployeeDepartmentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
