import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';

import { HealthCheckModule } from '~interface/modules/healthcheck.module';

const declaredModules = [HealthCheckModule];

@Module({
  imports: [
    ...declaredModules,
    RouterModule.register([
      {
        path: '',
        children: [HealthCheckModule],
      },
    ]),
  ],
})
export class AppModule {}
