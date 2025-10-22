import { ConsoleLogger, Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { EnvService } from '~infra/config/env/env.service';
import { AppModule } from './app.module';
import metadata from './metadata';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const env = app.get<EnvService>(EnvService);

  app.useLogger(
    new ConsoleLogger({
      showHidden: true,
      json: env.get('LOG_FORMAT') === 'json',
      logLevels: ['verbose', 'debug', 'log', 'warn', 'error', 'fatal'],
    }),
  );
  app.useGlobalPipes(
    new ValidationPipe({
      stopAtFirstError: false,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Wizdaa API')
    .setDescription('API Wizdaa Documentation')
    .setVersion('1.0');
  // .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' });

  const APP_PORT = env.get('PORT') ?? 3000;
  config.addServer(`http://localhost:${APP_PORT}`, 'Local');

  const swaggerUrl = 'docs';
  await SwaggerModule.loadPluginMetadata(metadata);
  const document = SwaggerModule.createDocument(app, config.build());
  SwaggerModule.setup(swaggerUrl, app, document, {
    yamlDocumentUrl: `${swaggerUrl}/yaml`,
    jsonDocumentUrl: `${swaggerUrl}/json`,
  });

  await app.listen(APP_PORT);
  Logger.log(`App running on port: ${APP_PORT}`);
}
bootstrap();
