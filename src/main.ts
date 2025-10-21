import { ConsoleLogger, Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useLogger(
    new ConsoleLogger({
      showHidden: true,
      // json: env.logFormat === 'production',
      json: false,
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

  config.addServer(`http://localhost:3330`, 'Local');

  const swaggerUrl = 'docs';
  const document = SwaggerModule.createDocument(app, config.build());
  SwaggerModule.setup(swaggerUrl, app, document, {
    yamlDocumentUrl: `${swaggerUrl}/yaml`,
    jsonDocumentUrl: `${swaggerUrl}/json`,
  });

  await app.listen(process.env.PORT ?? 3000);
  Logger.log(`App running on port: ${process.env.PORT ?? 3000}`);
}
bootstrap();
