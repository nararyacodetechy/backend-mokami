import { Test, TestingModule } from '@nestjs/testing';
import { DevopsService } from './devops.service';

describe('DevopsService', () => {
  let service: DevopsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DevopsService],
    }).compile();

    service = module.get<DevopsService>(DevopsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
