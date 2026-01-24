import { Test, TestingModule } from '@nestjs/testing';
import { BelbinNotificationService } from './belbin-notification.service';

describe('BelbinNotificationService', () => {
  let service: BelbinNotificationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BelbinNotificationService],
    }).compile();

    service = module.get<BelbinNotificationService>(BelbinNotificationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
