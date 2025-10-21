import { type HealthCheckResult, TerminusModule } from '@nestjs/terminus';
import { Test, type TestingModule } from '@nestjs/testing';

import { HealthCheckController } from '~interface/controllers/healthcheck/healthcheck.controller';

describe('HealthCheckController', () => {
  let controller: HealthCheckController;
  const outputResult: HealthCheckResult = {
    details: {
      template: {
        status: 'up',
      },
    },
    error: {},
    info: {
      template: {
        status: 'up',
      },
    },
    status: 'ok',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TerminusModule],
      controllers: [HealthCheckController],
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

  it('assures readiness follow the terminus output', () => {
    expect(
      controller.checkReadiness(),
    ).resolves.toMatchObject<HealthCheckResult>(outputResult);
  });
});
