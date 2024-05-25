import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiProperty, ApiTags } from '@nestjs/swagger';
import {
  HealthCheck,
  HealthCheckResult,
  HealthCheckService,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';

export class PingResponse {
  @ApiProperty()
  ping: 'pong';
}

@Controller()
@ApiTags('app')
export class AppController {
  constructor(
    private readonly healthService: HealthCheckService,
    private readonly databaseHealthIndicator: TypeOrmHealthIndicator,
  ) {}

  @Get()
  @ApiOkResponse({ type: PingResponse })
  getPing(): PingResponse {
    return { ping: 'pong' };
  }

  @Get('health')
  @HealthCheck()
  async getHealthCheck(): Promise<HealthCheckResult> {
    return await this.healthService.check([
      () => this.databaseHealthIndicator.pingCheck('database'),
    ]);
  }
}
