import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { CronModule } from './cron/cron.module';
import { EmailModule } from './email/email.module';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { BullModule } from '@nestjs/bull'

@Module({
  imports: [
    CronModule,
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot(typeOrmConfig),
    EmailModule,
    ConfigModule.forRoot({
      load:[configuration],
      expandVariables: true
    }),
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379
      }
    }),
    BullModule.registerQueue({
      name:'email-que'
    })  
  ],
})
export class AppModule {}
