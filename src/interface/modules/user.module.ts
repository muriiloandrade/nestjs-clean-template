import { Module } from '@nestjs/common';

import { UserRepository } from '~infra/repositories/user/user.service';
import { UserController } from '~interface/controllers/user/user.controller';

@Module({
  providers: [UserRepository],
  controllers: [UserController],
})
export class UserModule {}
