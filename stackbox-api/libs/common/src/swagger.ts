import { INestApplication, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';

export function useSwagger(app: INestApplication) {
  const logger: Logger = new Logger('Swagger');
  const config: ConfigService = app.get<ConfigService>(ConfigService);

  const builder: DocumentBuilder = new DocumentBuilder()
    .setTitle(config.get<string>('npm_package_name'))
    .setDescription(config.get<string>('npm_package_description'))
    .setVersion(config.get<string>('npm_package_version'));

  const document: OpenAPIObject = SwaggerModule.createDocument(
    app,
    builder.build(),
  );
  SwaggerModule.setup('swagger', app, document);
  logger.log('📚 Swagger enabled');
}
