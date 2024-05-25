import { INestApplication } from '@nestjs/common';
import { HealthCheckResult } from '@nestjs/terminus';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { PingResponse } from '../src/app.controller';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('/ (GET)', () => {
    const expected: PingResponse = { ping: 'pong' };
    return request(app.getHttpServer()).get('/').expect(200).expect(expected);
  });

  it('/health (GET)', () => {
    const expected: HealthCheckResult = {
      status: 'ok',
      details: {},
      info: {},
      error: {},
    };
    return request(app.getHttpServer())
      .get('/health')
      .expect(200)
      .expect(expected);
  });
});
