import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';

import { HealthCheckController } from '~interface/controllers/healthcheck/healthcheck.controller';

@Module({
  imports: [TerminusModule],
  controllers: [HealthCheckController],
})
export class HealthCheckModule {}
