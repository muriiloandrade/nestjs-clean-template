import { Controller, Get } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import {
  HealthCheck,
  HealthCheckService,
  HealthIndicatorResult,
} from '@nestjs/terminus';

@ApiExcludeController()
@Controller('health')
export class HealthCheckController {
  private readonly appName = 'template';

  constructor(private readonly healthService: HealthCheckService) {}

  @Get('liveness')
  @HealthCheck()
  checkLiveness() {
    return this.healthService.check([
      (): HealthIndicatorResult => ({
        [this.appName]: { status: 'up' },
      }),
    ]);
  }

  // This should have all the dependencies of the app
  @Get('readiness')
  @HealthCheck()
  checkReadiness() {
    return this.healthService.check([
      (): HealthIndicatorResult => ({
        [this.appName]: { status: 'up' },
      }),
    ]);
  }
}
