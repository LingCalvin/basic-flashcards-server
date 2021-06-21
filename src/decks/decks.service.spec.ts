import { Test, TestingModule } from '@nestjs/testing';
import { metadata } from './decks.module';
import { DecksService } from './decks.service';

describe('DecksService', () => {
  let service: DecksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule(
      metadata,
    ).compile();

    service = module.get<DecksService>(DecksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
