import { Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';

import { DB_KEY } from '~infra/config/db/constant';
import { DbSchema } from '~infra/database/schema';

@Injectable()
export class DbService {
  constructor(@Inject(DB_KEY) private readonly db: NodePgDatabase<DbSchema>) {}

  conn() {
    return this.db;
  }
}
