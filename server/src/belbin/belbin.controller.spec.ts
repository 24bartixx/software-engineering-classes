import { Test, TestingModule } from '@nestjs/testing';
import { BelbinController } from './belbin.controller';

describe('BelbinController', () => {
  let controller: BelbinController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BelbinController],
    }).compile();

    controller = module.get<BelbinController>(BelbinController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
