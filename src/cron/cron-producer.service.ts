import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';

interface CronData { id: number, name: string, hour: number, sec: number, minutes: number, firstRun: boolean }

@Injectable()
export class CronProducerService {
    constructor(@InjectQueue('email-que') private cronQueue: Queue) { }

    async setCronJob(data: CronData) {
        const job = await this.cronQueue.getJob(data.id)
        if (data.firstRun && job) {
            job.remove()
        }
        await this.cronQueue.add('cronjob', {
            task: data
        }, {
            jobId: data.id
        })
    }
}