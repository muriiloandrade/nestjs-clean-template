import { Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';

import { DbSchema } from '~infra/database/schema';

@Injectable()
export class DbService {
  constructor(@Inject('pg') private readonly db: NodePgDatabase<DbSchema>) {}

  conn() {
    return this.db;
  }
}
