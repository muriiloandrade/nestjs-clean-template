import { Global, Module } from '@nestjs/common';

import { DB_KEY } from '~infra/config/db/constant';
import { DbService } from '~infra/repositories/db/db.service';

@Global()
@Module({
  providers: [DbService, { provide: DB_KEY, useValue: DB_KEY }],
  exports: [DbService],
})
export class DbModule {}
