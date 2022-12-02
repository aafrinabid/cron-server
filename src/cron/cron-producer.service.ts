import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Queue } from 'bull';
import { CronData } from './cron-data.interface';
import { CronRepository } from './cron.repository';

@Injectable()
export class CronProducerService {

    constructor(
        @InjectQueue('email-que') private cronQueue: Queue,
        @InjectRepository(CronRepository)
        private readonly cronRepository: CronRepository,
    ) { }

    async setCronJob(data: CronData): Promise<void> {
        const bullJob = await this.cronQueue.getJob(data.repeatId)
        if (bullJob) {
            console.log(bullJob, 'here')
            await bullJob.remove()
        }
        const queueJob = await this.cronQueue.add('cronjob', {
            task: data
        }, {
            jobId: `${data.id}`,
            repeat: { cron: `${data.sec} ${data.minutes} ${data.hour} * * *` },
        })
        await this.cronRepository.updateRepeatId({ id: data.id, repeatId: queueJob.id })
    }
}