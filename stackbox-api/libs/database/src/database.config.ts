export interface IDatabaseConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  runMigrations: boolean;
}

type DatabaseConfigContainer = {
  database: IDatabaseConfig;
};

export default (): DatabaseConfigContainer => ({
  database: {
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT, 10),
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    runMigrations: process.env.DATABASE_RUN_MIGRATIONS === 'true',
  },
});
