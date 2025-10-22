import { Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';

import { DB_KEY } from '~infra/config/db/constant';
import { DbSchema } from '~infra/database/schema';

export type DatabaseClient = NodePgDatabase<DbSchema>;

@Injectable()
export class DbService {
  constructor(@Inject(DB_KEY) private readonly db: DatabaseClient) {}

  conn() {
    return this.db;
  }
}
