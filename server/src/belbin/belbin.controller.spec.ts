import { Test, TestingModule } from '@nestjs/testing';
import { BelbinController } from './belbin.controller';
import { BelbinService } from './service/belbin.service';

describe('BelbinController', () => {
  let controller: BelbinController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BelbinController],
      providers: [
        {
          provide: BelbinService,
          useValue: {
            getBelbinQuestions: jest.fn(),
            saveTestResults: jest.fn(),
            getEmployeesTestInfo: jest.fn(),
            getExpiredBelbinTests: jest.fn(),
            getEmployeeTestResults: jest.fn(),
            sendReminderNotification: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<BelbinController>(BelbinController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});