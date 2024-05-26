import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { IAppConfig, useSwagger } from '@stackbox/common';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger: Logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);
  const config: ConfigService = app.get<ConfigService>(ConfigService);
  const appConfig: IAppConfig = config.get<IAppConfig>('app');

  app.enableShutdownHooks();

  app.enableCors({ origin: appConfig.allowedOrigins });
  logger.log(
    `Allowed origins: ${appConfig.allowedOrigins.length > 0 ? appConfig.allowedOrigins.join(', ') : 'None'}`,
  );

  app.enableVersioning({
    type: VersioningType.URI,
    prefix: 'v',
    defaultVersion: '1',
  });

  app.use(helmet());

  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

  if (appConfig.enableSwagger) useSwagger(app);

  await app.listen(appConfig.port);
  logger.log(`🚀 Application is running listening on port ${appConfig.port}`);
}

bootstrap();
