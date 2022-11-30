import { Injectable } from '@nestjs/common';
import { SchedulerRegistry, Timeout } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { CronRepository } from './cron.repository';
import { DateAndJobDto } from './date.dto';
import { CronJobs } from './job.entity';
import { CronTime } from 'cron';
import { CronProducerService } from './cron-producer.service';

@Injectable()
export class CronService {

    constructor(
        private scheduleRegistry: SchedulerRegistry,
        @InjectRepository(CronRepository)
        private readonly cronRepository: CronRepository,
        private readonly cronProducerService: CronProducerService
    ) { }

    @Timeout(1000)
    async runCronJob(): Promise<void> {
        try {
            console.log('running for cronjobs')
            const cronJobs: { jobs: CronJobs[] } = await this.cronRepository.fetchAllJobs()
            cronJobs.jobs.forEach(async (job) => {
                const { sec, minutes, hour } = getTimesFromDate(job.cronTime)
                const cronDetail = { sec, minutes, hour, name: job.jobName, id: job.id, firstRun: true }
                await this.cronProducerService.setCronJob(cronDetail)
            })
        } catch (e) {
            console.log(e)
        }
    }

    async changeDateForNotifier(dateAndJobDto: DateAndJobDto) {
        try {
            const { date, name } = dateAndJobDto
            const cronDate = new Date(date)
            const { sec, minutes, hour } = getTimesFromDate(cronDate)
            const result = await this.cronRepository.UpdateCronJobTime(dateAndJobDto)
            const cronDetails = { sec, minutes, hour, id: result.id, firstRun: false, name }
            await this.cronProducerService.setCronJob(cronDetails)
            return result
        } catch (e) {
            console.log(e)
        }
    }

    async findAllJobs(): Promise<{ jobs: CronJobs[] }> {
        try {
            return await this.cronRepository.fetchAllJobs()
        } catch (e) {
            console.log(e)
        }
    }

    async createCronJob(dateAndJobDto: DateAndJobDto) {
        try {
            const { date, name } = dateAndJobDto;
            const cronTime = new Date(date)
            const { sec, minutes, hour } = getTimesFromDate(cronTime)
            const cronData = await this.cronRepository.createCronJob(dateAndJobDto)
            const cronDetails = { name, sec, minutes, hour, id: cronData.id, firstRun: false }
            await this.cronProducerService.setCronJob(cronDetails)
            return cronData
        } catch (e) {
            console.log(e)
        }
    }
}

function getTimesFromDate(date: Date) {
    const sec = date.getSeconds()
    const minutes = date.getMinutes()
    const hour = date.getHours()
    return { sec, minutes, hour }
}