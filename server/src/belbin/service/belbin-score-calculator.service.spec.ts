import { Test, TestingModule } from '@nestjs/testing';
import { BelbinScoreCalculator } from './belbin-score-calculator.service';
import { BelbinQuestion } from "../entities/belbin-question.entity";
import { BelbinTest } from "../entities/belbin-test.entity";

describe('BelbinScoreCalculator', () => {
  let service: BelbinScoreCalculator;

  const mockQuestions = [
    {
      id: 1,
      statements: [
        { id: '1-A', relatedRoleFieldName: 'shaperScore' },
        { id: '1-B', relatedRoleFieldName: 'shaperScore' },
        { id: '1-C', relatedRoleFieldName: 'specialistScore' },
        { id: '1-D', relatedRoleFieldName: 'plantScore' },
        { id: '1-E', relatedRoleFieldName: 'plantScore' },
        { id: '1-F', relatedRoleFieldName: 'plantScore' },
      ],
    },
  ] as BelbinQuestion[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BelbinScoreCalculator],
    }).compile();

    service = module.get<BelbinScoreCalculator>(BelbinScoreCalculator);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should successfully add points for related roles', () => {
    // ARRANGE
    const testEntity = new BelbinTest();
    const answers = {
      '1-A': 6,
      '1-B': 4,
      '1-C': 4,
      '1-D': 4,
      '1-E': 4,
      '1-F': 4,
    };

    // ACT
    const result = service.calculate(testEntity, answers, mockQuestions);

    // ASSERT
    expect(result.shaperScore).toBe(10);
    expect(result.specialistScore).toBe(4);
    expect(result.plantScore).toBe(12);
    expect(result.coordinatorScore).toBeFalsy();
    expect(result.implementerScore).toBeFalsy();
    expect(result.teamWorkerScore).toBeFalsy();
    expect(result.resourceInvestigatorScore).toBeFalsy();
    expect(result.monitorEvaluatorScore).toBeFalsy();
    expect(result.completerFinisherScore).toBeFalsy();
  });

  it('should reset old results before the new calculation', () => {
    // ARRANGE
    const testEntity = new BelbinTest();
    testEntity.shaperScore = 999;
    testEntity.plantScore = 1;
    testEntity.specialistScore = 0;

    const answers = {
      '1-A': 5,
      '1-C': 1,
      '1-D': 2,
    };

    // ACT
    const result = service.calculate(testEntity, answers, mockQuestions);

    // ASSERT
    expect(result.shaperScore).toBe(5);
    expect(result.specialistScore).toBe(1);
    expect(result.plantScore).toBe(2);
  });

  it('should ignore answers non matching to any question', () => {
    // ARRANGE
    const testEntity = new BelbinTest();
    const answers = {
      '1-A': 10,
      'UNKNOWN_ID_XYZ': 500,
      '1-C': 2,
    };

    // ACT
    const result = service.calculate(testEntity, answers, mockQuestions);

    // ASSERT
    expect(result.shaperScore).toBe(10);
    expect(result.specialistScore).toBe(2);
  });
});