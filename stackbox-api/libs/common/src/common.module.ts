import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CrudService } from './services/crud.service';
import { CrudController } from './controllers/crud.controller';
import appConfig from './app.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
    }),
  ],
  providers: [CrudService],
  controllers: [CrudController],
})
export class CommonModule {}
