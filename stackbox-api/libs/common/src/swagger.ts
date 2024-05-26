import {
  INestApplication,
  Logger,
  Type,
  applyDecorators,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ApiExtraModels,
  ApiOkResponse,
  DocumentBuilder,
  OpenAPIObject,
  SwaggerModule,
  getSchemaPath,
} from '@nestjs/swagger';
import { PaginationDto } from './models/common.models';

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
    {
      operationIdFactory: (_controllerKey: string, methodKey: string) =>
        methodKey,
    },
  );
  SwaggerModule.setup('swagger', app, document);
  logger.log('📚 Swagger enabled');
}

export const ApiPaginatedResponse = <TModel extends Type<any>>(
  model: TModel,
) => {
  return applyDecorators(
    ApiExtraModels(PaginationDto, model),
    ApiOkResponse({
      schema: {
        title: `Paginated${model.name}Dto`,
        allOf: [
          { $ref: getSchemaPath(PaginationDto) },
          {
            properties: {
              items: {
                type: 'array',
                items: { $ref: getSchemaPath(model) },
              },
            },
          },
        ],
      },
    }),
  );
};

type Constructor<T = object> = new (...args: any[]) => T;
type Wrapper<T = object> = { new (): T & any; prototype: T };
type DecoratorOptions = { name: string };
type ApiSchemaDecorator = <T extends Constructor>(
  options: DecoratorOptions,
) => (constructor: T) => Wrapper<T>;

export const ApiSchema: ApiSchemaDecorator = ({ name }) => {
  return (constructor) => {
    const wrapper = class extends constructor {};
    Object.defineProperty(wrapper, 'name', {
      value: name,
      writable: false,
    });
    return wrapper;
  };
};
