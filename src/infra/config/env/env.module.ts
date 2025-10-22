import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { envSchema } from '~infra/config/env/env';
import { EnvService } from '~infra/config/env/env.service';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (config) => envSchema.parse(config),
      cache: true,
    }),
  ],
  providers: [EnvService],
  exports: [EnvService],
})
export class EnvModule {}
