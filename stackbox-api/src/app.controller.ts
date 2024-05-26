import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiOkResponse, ApiProperty, ApiTags } from '@nestjs/swagger';
import {
  HealthCheck,
  HealthCheckResult,
  HealthCheckService,
  HttpHealthIndicator,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';
import { PublicEndpoint } from '../libs/auth/src';

export class PingResponse {
  @ApiProperty()
  ping: 'pong';
}

@Controller()
@ApiTags('app')
export class AppController {
  constructor(
    private readonly config: ConfigService,
    private readonly healthService: HealthCheckService,
    private readonly databaseHealthIndicator: TypeOrmHealthIndicator,
    private readonly httpHealthIndicator: HttpHealthIndicator,
  ) {}

  @Get()
  @ApiOkResponse({ type: PingResponse })
  @PublicEndpoint()
  getPing(): PingResponse {
    return { ping: 'pong' };
  }

  @Get('health')
  @HealthCheck()
  @PublicEndpoint()
  async getHealthCheck(): Promise<HealthCheckResult> {
    return await this.healthService.check([
      () => this.databaseHealthIndicator.pingCheck('database'),
      () =>
        this.httpHealthIndicator.pingCheck(
          'auth0',
          this.config.get<string>('auth.issuerUrl'),
        ),
    ]);
  }
}
