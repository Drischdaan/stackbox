import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckResult,
  HealthCheckService,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';

export class PingResponse {
  ping: 'pong';
}

@Controller()
export class AppController {
  constructor(
    private readonly healthService: HealthCheckService,
    private readonly databaseHealthIndicator: TypeOrmHealthIndicator,
  ) {}

  @Get()
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
