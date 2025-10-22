import { Test, TestingModule } from '@nestjs/testing';

import { DB_KEY } from '~infra/config/db/constant';
import { DbService } from '~infra/repositories/db/db.service';
import { UserRepository } from '~infra/repositories/user/user.service';

describe('UserRepository', () => {
  let service: UserRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserRepository,
        DbService,
        { provide: DB_KEY, useValue: 'pg-test' },
      ],
    }).compile();

    service = module.get<UserRepository>(UserRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
