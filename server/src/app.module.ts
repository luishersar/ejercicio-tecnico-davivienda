import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config as dotenvConfig } from 'dotenv';
import { SurveysModule } from './surveys/surveys.module';
import { StatisticsModule } from './statistics/statistics.module';
import AppDataSource from './typeorm.config';
dotenvConfig({ path: './.env' });

@Module({
  imports: [
    TypeOrmModule.forRoot(AppDataSource.options),
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SurveysModule,
    StatisticsModule,
  ],
})
export class AppModule {}
