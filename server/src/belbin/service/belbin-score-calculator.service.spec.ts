import { Test, TestingModule } from '@nestjs/testing';
import { BelbinScoreCalculatorService } from './belbin-score-calculator.service';

describe('BelbinScoreCalculatorService', () => {
  let service: BelbinScoreCalculatorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BelbinScoreCalculatorService],
    }).compile();

    service = module.get<BelbinScoreCalculatorService>(BelbinScoreCalculatorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
