import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import path from 'path';
import databaseConfig, { IDatabaseConfig } from './database.config';

@Module({
  imports: [
    ConfigModule.forFeature(databaseConfig),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const databaseConfig: IDatabaseConfig =
          config.get<IDatabaseConfig>('database');
        return {
          type: 'postgres',
          host: databaseConfig.host,
          port: databaseConfig.port,
          username: databaseConfig.username,
          password: databaseConfig.password,
          database: databaseConfig.database,
          autoLoadEntities: true,
          synchronize: true,
          retryDelay: 30000,
          migrationsRun: databaseConfig.runMigrations,
          migrations: [path.join(__dirname, 'migrations', '*.{ts,js}')],
        };
      },
    }),
  ],
})
export class DatabaseModule {}
