import { Injectable } from '@nestjs/common';
import { Cron, Timeout } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { CronRepository } from './cron.repository';
import { DateAndJobDto } from './date.dto';
import { CronJobs } from './job.entity';
import { CronProducerService } from './cron-producer.service';
import { JobId } from 'bull'

interface CronData { id: number, name: string, hour: number, sec: number, minutes: number, repeatId: any }

@Injectable()
export class CronService {

    constructor(
        @InjectRepository(CronRepository)
        private readonly cronRepository: CronRepository,
        private readonly cronProducerService: CronProducerService
    ) { }

    @Cron('*/30 * * * * *')
    async checkQueue() {
        console.log('cron is running')
        let allTasks: CronData[] = await this.cronRepository.checkCronJobs()
        await this.cronProducerService.checkCronJobs(allTasks)
    }

    @Timeout(1000)
    async runCronJob(): Promise<void> {
        try {
            console.log('running for cronjobs')
            const cronJobs: { jobs: CronJobs[] } = await this.cronRepository.fetchAllJobs()
            cronJobs.jobs.forEach(async (job) => {
                const { sec, minutes, hour } = getTimesFromDate(job.cronTime)
                const cronDetail: CronData = { sec, minutes, hour, name: job.jobName, id: job.id, repeatId: job.repeatId }
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
            const cronDetails :CronData = { sec, minutes, hour, id: result.id, name, repeatId: result.repeatId }
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
            const cronDetails: CronData = { name, sec, minutes, hour, id: cronData.id, repeatId: cronData.repeatId }
            await this.cronProducerService.setCronJob(cronDetails)
            return cronData
        } catch (e) {
            console.log(e)
        }
    }
}

export function getTimesFromDate(date: Date) {
    const sec = date.getSeconds()
    const minutes = date.getMinutes()
    const hour = date.getHours()
    return { sec, minutes, hour }
}