import { type HealthCheckResult, TerminusModule } from '@nestjs/terminus';
import { Test, type TestingModule } from '@nestjs/testing';

import { DB_KEY } from '~infra/config/db/constant';
import { DbService } from '~infra/repositories/db/db.service';
import { HealthCheckController } from '~interface/controllers/healthcheck/healthcheck.controller';
import { DbHealthIndicator } from '~interface/framework/health-indicators/db';

describe('HealthCheckController', () => {
  let controller: HealthCheckController;
  const outputResult: HealthCheckResult = {
    details: {
      'template-api': {
        status: 'up',
      },
    },
    error: {},
    info: {
      'template-api': {
        status: 'up',
      },
    },
    status: 'ok',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TerminusModule],
      controllers: [HealthCheckController],
      providers: [
        DbHealthIndicator,
        DbService,
        { provide: DB_KEY, useValue: 'pg-test' },
      ],
    }).compile();

    controller = module.get<HealthCheckController>(HealthCheckController);
  });

  it('assures controller is defined', () => {
    expect(controller).toBeDefined();
  });

  it('assures liveness follow the terminus output', () => {
    expect(
      controller.checkLiveness(),
    ).resolves.toMatchObject<HealthCheckResult>(outputResult);
  });
});
