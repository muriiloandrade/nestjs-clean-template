import { Test, TestingModule } from '@nestjs/testing';

import { DB_KEY } from '~infra/config/db/constant';
import { DbService } from '~infra/repositories/db/db.service';

describe('DbService', () => {
  let service: DbService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DbService, { provide: DB_KEY, useValue: 'pg-test' }],
    }).compile();

    service = module.get<DbService>(DbService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
