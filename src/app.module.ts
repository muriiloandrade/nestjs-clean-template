import { DrizzlePGModule } from '@knaadh/nestjs-drizzle-pg';
import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { PoolConfig } from 'pg';

import { EnvModule } from '~infra/config/env/env.module';
import { EnvService } from '~infra/config/env/env.service';
import { DbModule } from '~interface/modules/db.module';
import { HealthCheckModule } from '~interface/modules/healthcheck.module';
import { UserModule } from '~interface/modules/user.module';

const declaredModules = [
  HealthCheckModule,
  EnvModule,
  UserModule,
  DrizzlePGModule.registerAsync({
    inject: [EnvService],
    tag: 'pg',
    useFactory: (envService: EnvService) => ({
      pg: {
        connection: 'pool',
        config: {
          application_name: 'template-api',
          max: 10,
          database: envService.get('PG_DATABASE'),
          host: envService.get('PG_HOST'),
          password: envService.get('PG_PASSWORD'),
          port: envService.get('PG_PORT'),
          user: envService.get('PG_USER'),
          idleTimeoutMillis: 30000,
          connectionTimeoutMillis: 2000,
          ssl: false,
          lock_timeout: 10000,
        } as PoolConfig,
      },
      config: {
        schema: './infra/database/schema',
      },
    }),
  }),
  DbModule,
];

@Module({
  imports: [
    ...declaredModules,
    RouterModule.register([
      {
        path: '',
        children: [HealthCheckModule],
      },
      {
        path: '/api/v1',
        children: [
          {
            path: '/users',
            module: UserModule,
          },
        ],
      },
    ]),
  ],
})
export class AppModule {}
