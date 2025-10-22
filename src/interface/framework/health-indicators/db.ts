import { Injectable } from '@nestjs/common';
import { HealthIndicatorService } from '@nestjs/terminus';
import { sql } from 'drizzle-orm';

import { DbService } from '~infra/repositories/db/db.service';

@Injectable()
export class DbHealthIndicator {
  constructor(
    private readonly db: DbService,
    private readonly healthIndicatorService: HealthIndicatorService,
  ) {}

  async isHealthy(key: string) {
    const indicator = this.healthIndicatorService.check(key);

    try {
      await this.db.conn().execute(sql`SELECT 1`);
      return indicator.up();
    } catch (error) {
      return indicator.down({ message: 'Database connection failed', error });
    }
  }
}
