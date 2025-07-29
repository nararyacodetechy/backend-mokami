import { Test, TestingModule } from '@nestjs/testing';
import { ProductManagerService } from './product-manager.service';

describe('ProductManagerService', () => {
  let service: ProductManagerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductManagerService],
    }).compile();

    service = module.get<ProductManagerService>(ProductManagerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
