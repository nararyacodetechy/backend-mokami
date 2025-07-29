import { Test, TestingModule } from '@nestjs/testing';
import { ProductManagerController } from './product-manager.controller';

describe('ProductManagerController', () => {
  let controller: ProductManagerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductManagerController],
    }).compile();

    controller = module.get<ProductManagerController>(ProductManagerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
