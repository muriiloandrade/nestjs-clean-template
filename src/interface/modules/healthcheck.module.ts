import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';

import { HealthCheckController } from '~interface/controllers/healthcheck/healthcheck.controller';
import { DbHealthIndicator } from '~interface/framework/health-indicators/db';

@Module({
  imports: [TerminusModule],
  controllers: [HealthCheckController],
  providers: [DbHealthIndicator],
})
export class HealthCheckModule {}
