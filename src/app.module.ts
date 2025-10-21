import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';

import { EnvModule } from '~infra/config/env/env.module';
import { HealthCheckModule } from '~interface/modules/healthcheck.module';

const declaredModules = [HealthCheckModule, EnvModule];

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
