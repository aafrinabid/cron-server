import { Module } from '@nestjs/common';
import { CronService } from './cron.service';
import { CronController } from './cron.controller';
import { CronRepository } from './cron.repository';
import { EmailModule } from 'src/email/email.module';
import {BullModule} from '@nestjs/bull'
import { CronConsumer } from '../cron.consumer';
import { CronProducerService } from './cron-producer.service';

@Module({
  imports:[
    EmailModule, 
    BullModule.registerQueue({
    name:'email-que',
    }),
 ],
  providers: [CronService, CronRepository, CronProducerService],
  controllers: [CronController],
  exports: [CronRepository]
})
export class CronModule {}
