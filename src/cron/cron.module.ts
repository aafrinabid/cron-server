import { Module } from '@nestjs/common';
import { CronService } from './cron.service';
import { CronController } from './cron.controller';
import { CronRepository } from './cron.repository';
import { EmailModule } from 'src/email/email.module';

@Module({
  imports:[EmailModule],
  providers: [CronService, CronRepository],
  controllers: [CronController]
})
export class CronModule {}
