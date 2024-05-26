import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TerminusModule } from '@nestjs/terminus';
import { CommonModule } from '../libs/common/src';
import { DatabaseModule } from '../libs/database/src';
import { ProductsModule } from '../libs/products/src';
import { AppController } from './app.controller';

@Module({
  imports: [CommonModule, TerminusModule, DatabaseModule, ProductsModule],
  controllers: [AppController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
  ],
})
export class AppModule {}
