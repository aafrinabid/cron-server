import { Body, Controller, Patch, Post } from '@nestjs/common';
import { CronService } from './cron.service';
import { DateAndJobDto } from './date.dto';
import { CronJobs } from './job.entity';
import { CronUpdateResult } from './update-cron.interface';

@Controller('cron')
export class CronController {

    constructor(
        private cronService: CronService
    ) { }

    @Post('/job')
    async createJob(@Body() dateAndDto: DateAndJobDto): Promise<CronJobs> {
        return this.cronService.createCronJob(dateAndDto)
    }

    @Patch('/job')
    async updateJob(@Body() dateAndDto: DateAndJobDto): Promise<CronUpdateResult> {
        return this.cronService.changeDateForNotifier(dateAndDto)
    }
}
