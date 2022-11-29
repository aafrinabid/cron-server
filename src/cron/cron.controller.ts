import { Body, Controller, Patch, Post } from '@nestjs/common';
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

    @GrpcMethod('CronTimeService')
    triggerTimeOutCallback() {
        return this.cronService.runCronJob()
    }

    @Post('/job')
    async createJob(@Body() dateAndDto: DateAndJobDto) {
        return this.cronService.createCronJob(dateAndDto)
    }

    @Post('/runCron')
    async runCron() {
        return this.cronService.runCronJob()
    }

    @Patch('/job')
    async updateJob(@Body() dateAndDto: DateAndJobDto) {
        return this.cronService.changeDateForNotifier(dateAndDto)
    }
}
