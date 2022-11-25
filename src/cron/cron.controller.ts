import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { CronService } from './cron.service';
import { DateAndJobDto } from './date.dto';

@Controller('cron')
export class CronController {
    constructor(
        private cronService: CronService
    ) { }

    @GrpcMethod('CronTimeService')
    changeCronTime(dateAndJobDto: DateAndJobDto) {
        return this.cronService.changeDateForNotifier(dateAndJobDto)
    }

    @GrpcMethod('CronTimeService')
    findAllJobs() {
        return this.cronService.findAllJobs()
    }

    @GrpcMethod('CronTimeService')
    createCronJob(dateAndJobDto: DateAndJobDto) {
        return this.cronService.createCronJob(dateAndJobDto)
    }
}
