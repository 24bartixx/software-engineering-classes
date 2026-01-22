import { Test, TestingModule } from '@nestjs/testing';
import { HrEmployeeController } from './hr-employee.controller';
import { HrEmployeeService } from './hr-employee.service';

describe('HrEmployeeController', () => {
  let controller: HrEmployeeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HrEmployeeController],
      providers: [HrEmployeeService],
    }).compile();

    controller = module.get<HrEmployeeController>(HrEmployeeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
