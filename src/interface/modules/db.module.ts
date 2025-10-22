import { Global, Module } from '@nestjs/common';

import { DbService } from '~infra/repositories/db/db.service';

@Global()
@Module({
  providers: [DbService],
  exports: [DbService],
})
export class DbModule {}
