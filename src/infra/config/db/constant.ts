import { InjectionToken } from '@nestjs/common';

import { DatabaseClient } from '~infra/repositories/db/db.service';

export const DB_KEY: InjectionToken<DatabaseClient> = 'pg';
