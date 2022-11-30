import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';

interface CronData { id: number, name: string, hour: number, sec: number, minutes: number}

@Injectable()
export class CronProducerService {
    constructor(@InjectQueue('email-que') private cronQueue: Queue) { }

    async setCronJob(data: CronData) {
        await this.cronQueue.add('cronjob', {
            task: data
        }, {
            jobId: data.id,
            repeat: { cron:`${data.sec} ${data.minutes} ${data.hour} * * *` },
        })
    }
}