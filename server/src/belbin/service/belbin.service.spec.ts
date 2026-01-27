import { Test, TestingModule } from '@nestjs/testing';
import { BelbinService } from './belbin.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BelbinTest } from '../entities/belbin-test.entity';
import { BelbinQuestion } from '../entities/belbin-question.entity';
import { BelbinRolesMetadata } from '../entities/belbin-roles-metadata.entity';
import { Employee } from '../../employee/entities/employee.entity';
import { BelbinNotificationService } from './belbin-notification.service';
import { BelbinScoreCalculator } from './belbin-score-calculator.service';
import { SystemConfigService } from '../../system-config/system-config.service';
import { BelbinConverter } from '../belbin.converter';
import { Repository } from "typeorm";
import { NotFoundException } from "@nestjs/common";
import {BelbinTestStatus} from "../dto/employee-test-status.dto";
import { addDays, subDays } from "date-fns";

describe('BelbinService', () => {
  let service: BelbinService;
  let employeeRepo: jest.Mocked<Repository<Employee>>;
  let belbinTestRepo: jest.Mocked<Repository<BelbinTest>>;
  let scoreCalculator: { calculate: jest.Mock };

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
        BelbinService,
        { provide: getRepositoryToken(BelbinTest), useValue: mockRepository() },
        { provide: getRepositoryToken(BelbinQuestion), useValue: mockRepository() },
        { provide: getRepositoryToken(BelbinRolesMetadata), useValue: mockRepository() },
        { provide: getRepositoryToken(Employee), useValue: mockRepository() },
        {
          provide: BelbinNotificationService,
          useValue: {
            sendReminder: jest.fn(),
            getReminderBlockedMap: jest.fn(),
          }
        },
        {
          provide: BelbinScoreCalculator,
          useValue: {
            calculate: jest.fn(),
          }
        },
        {
          provide: SystemConfigService,
          useValue: {
            getOrThrow: jest.fn(),
          }
        },
        {
          provide: BelbinConverter,
          useValue: {
            mapToExpiredDto: jest.fn(),
            mapToBelbinResultDto: jest.fn(),
          }
        }
      ],
    }).compile();

    service = module.get<BelbinService>(BelbinService);
    employeeRepo = module.get(getRepositoryToken(Employee));
    belbinTestRepo = module.get(getRepositoryToken(BelbinTest));
    scoreCalculator = module.get(BelbinScoreCalculator);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('saveTestResults', () => {
    it('should save new test results successfully', async () => {
      // ARRANGE
      const answersDto = { id: 1, answers: { '1a': 5 } };
      const employee = { id: 1, user: { first_name: 'Jan' } };

      employeeRepo.findOne.mockReturnValue(employee as any);
      belbinTestRepo.findOne.mockReturnValue(null as any);
      belbinTestRepo.save.mockImplementation((test) => Promise.resolve({ ...test, id: 100 } as any));

      // ACT
      await service.saveTestResults(answersDto);

      // ASSERT
      expect(scoreCalculator.calculate).toHaveBeenCalled();
      expect(belbinTestRepo.save).toHaveBeenCalledWith(expect.objectContaining({
        employee: employee,
        performedAt: expect.any(Date)
      }));
    });

    it('should update existing test results if test already exists', async () => {
      // ARRANGE
      const answersDto = { id: 2, answers: { '1a': 5 } };
      const employee = { id: 2 };
      const existingTest = { id: 50, employee: employee, shaperScore: 0 };

      employeeRepo.findOne.mockReturnValue(employee as any);
      belbinTestRepo.findOne.mockReturnValue(existingTest as any);

      // ACT
      await service.saveTestResults(answersDto);

      // ASSERT
      expect(belbinTestRepo.save).toHaveBeenCalledWith(expect.objectContaining({
        id: 50
      }));
    });

    it('should throw NotFound if employee does not exist', async () => {
      // ARRANGE
      employeeRepo.findOne.mockReturnValue(null as any);

      // ACT & ASSERT
      await expect(service.saveTestResults({ id: 999, answers: {} }))
        .rejects
        .toThrow(NotFoundException);

      expect(belbinTestRepo.save).not.toHaveBeenCalled();
    });
  });

  describe('calculateTestStatus', () => {
    it('should return NOT_STARTED when test is null', () => {
      // ARRANGE
      const validityDays = 180;
      // ACT
      const result = (service as any).calculateTestStatus(null, validityDays);

      // ASSERT
      expect(result.status).toBe(BelbinTestStatus.NOT_STARTED);
      expect(result.lastTestDate).toBeNull();
      expect(result.expirationDate).toBeNull();
    });

    it('should return COMPLETED when test date is within validity period', () => {
      // ARRANGE
      const validityDays = 180;
      const test = new BelbinTest();
      test.performedAt = subDays(new Date(), validityDays);
      const expectedExpiration = addDays(test.performedAt, validityDays);

      // ACT
      const result = (service as any).calculateTestStatus(test, validityDays);

      // ASSERT
      expect(result.status).toBe(BelbinTestStatus.COMPLETED);
      expect(result.lastTestDate).toEqual(test.performedAt);
      expect(result.expirationDate.toLocaleDateString())
        .toBe(expectedExpiration.toLocaleDateString());
    });

    it('should return EXPIRED when test validity has passed', () => {
      // ARRANGE
      const validityDays = 180;
      const test = new BelbinTest();
      test.performedAt = subDays(new Date(), validityDays + 20);

      // ACT
      const result = (service as any).calculateTestStatus(test, validityDays);

      // ASSERT
      expect(result.status).toBe(BelbinTestStatus.EXPIRED);
      expect(result.lastTestDate).toEqual(test.performedAt);
      expect(result.expirationDate.getTime()).toBeLessThan((new Date()).getTime());
    });
  });
});