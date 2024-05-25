import { Controller, Get } from '@nestjs/common';

export class PingResponse {
  ping: 'pong';
}

@Controller()
export class AppController {
  @Get()
  getPing(): PingResponse {
    return { ping: 'pong' };
  }
}
