import { DataSource } from 'typeorm';
import { config as dotenvConfig } from 'dotenv';

dotenvConfig({ path: './.env' });

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT ?? 5432),
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: ['dist/migrations/*{.ts,.js}'],
  synchronize: false,
  ssl: {
    rejectUnauthorized: false,
  },
});

export default AppDataSource;
