import { DrizzlePGModule } from '@knaadh/nestjs-drizzle-pg';
import { INestApplication, Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import supertest from 'supertest';
import { App } from 'supertest/types';

import { DB_KEY } from '~infra/config/db/constant';
import { EnvModule } from '~infra/config/env/env.module';
import { EnvService } from '~infra/config/env/env.service';
import { DbModule } from '~interface/modules/db.module';
import { HealthCheckModule } from '~interface/modules/healthcheck.module';

describe('HealthCheck (e2e)', () => {
  let app: INestApplication<App>;
  const DB_KEY_VALUE = 'pg-test';

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        EnvModule,
        HealthCheckModule,
        DbModule,
        DrizzlePGModule.registerAsync({
          tag: DB_KEY_VALUE,
          inject: [EnvService],
          useFactory: (env: EnvService) => ({
            pg: {
              connection: 'pool',
              config: {
                application_name: 'template-test',
                max: 10,
                database: env.get('PG_DATABASE'),
                host: 'localhost',
                password: env.get('PG_PASSWORD'),
                port: env.get('PG_PORT'),
                user: env.get('PG_USER'),
                ssl: false,
              },
            },
            config: {
              schema: '../src/infra/database/schema',
            },
          }),
        }),
      ],
      providers: [{ provide: DB_KEY, useValue: DB_KEY_VALUE }],
    })
      .setLogger(new Logger())
      .compile();

    app = moduleFixture.createNestApplication();

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/health/liveness (GET)', () => {
    return supertest(app.getHttpServer()).get('/health/liveness').expect(200);
  });

  it('/health/readiness (GET)', () => {
    return supertest(app.getHttpServer()).get('/health/readiness').expect(200);
  });
});
