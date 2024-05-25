import { TestBed } from '@automock/jest';
import { HealthCheckResult, HealthCheckService } from '@nestjs/terminus';
import { AppController, PingResponse } from './app.controller';

describe('AppController', () => {
  let appController: AppController;
  let healthService: jest.Mocked<HealthCheckService>;

  beforeEach(async () => {
    const { unit, unitRef } = TestBed.create(AppController).compile();

    appController = unit;
    healthService = unitRef.get<HealthCheckService>(HealthCheckService);
  });

  describe('root', () => {
    it('should return ping response', () => {
      const expected: PingResponse = { ping: 'pong' };
      expect(appController.getPing()).toEqual(expected);
    });
  });

  describe('health', () => {
    it('should return health check result', async () => {
      const expected: HealthCheckResult = {
        status: 'ok',
        info: { database: { status: 'up' } },
        error: {},
        details: { database: { status: 'up' } },
      };
      healthService.check.mockResolvedValueOnce(expected);

      const result = await appController.getHealthCheck();
      expect(result).toEqual(expected);
    });
  });
});
