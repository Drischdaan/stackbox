import 'dotenv/config';
import path from 'path';
import { DataSource } from 'typeorm';

const dataSource: DataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT, 10),
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  logging: true,
  synchronize: false,
  entities: [
    path.join(__dirname, '../..', '**', '*.entity.{ts,js}'),
    path.join(__dirname, '../../..', 'src', '**', '*.entity.{ts,js}'),
  ],
  migrations: [path.join(__dirname, 'migrations', '*.{ts,js}')],
});

export default dataSource;
