import { Test, TestingModule } from '@nestjs/testing';
import { BelbinService } from './belbin.service';

describe('BelbinService', () => {
  let service: BelbinService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BelbinService],
    }).compile();

    service = module.get<BelbinService>(BelbinService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
