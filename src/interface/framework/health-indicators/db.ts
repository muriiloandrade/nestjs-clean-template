import { Inject, Injectable } from '@nestjs/common';
import { HealthIndicatorService } from '@nestjs/terminus';
import { sql } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';

import { DbSchema } from '~infra/database/schema';

@Injectable()
export class DbHealthIndicator {
  constructor(
    @Inject('pg') private readonly db: NodePgDatabase<DbSchema>,
    private readonly healthIndicatorService: HealthIndicatorService,
  ) {}

  async isHealthy(key: string) {
    const indicator = this.healthIndicatorService.check(key);

    try {
      await this.db.execute(sql`SELECT 1`);
      return indicator.up();
    } catch (error) {
      return indicator.down({ message: 'Database connection failed', error });
    }
  }
}
