import { Test, TestingModule } from '@nestjs/testing';
import { DevopsController } from './devops.controller';

describe('DevopsController', () => {
  let controller: DevopsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DevopsController],
    }).compile();

    controller = module.get<DevopsController>(DevopsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
