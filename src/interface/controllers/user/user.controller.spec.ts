import { Test, TestingModule } from '@nestjs/testing';

import { DB_KEY } from '~infra/config/db/constant';
import { DbService } from '~infra/repositories/db/db.service';
import { UserRepository } from '~infra/repositories/user/user.service';
import { UserController } from '~interface/controllers/user/user.controller';

describe('UserController', () => {
  let controller: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        UserRepository,
        DbService,
        { provide: DB_KEY, useValue: 'pg-test' },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
