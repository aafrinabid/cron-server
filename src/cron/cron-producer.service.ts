import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Queue } from 'bull';
import { job } from 'cron';
import { CronRepository } from './cron.repository';

interface CronData { id: number, name: string, hour: number, sec: number, minutes: number ,repeatId: string }

@Injectable()
export class CronProducerService {

    constructor(
        @InjectQueue('email-que') private cronQueue: Queue,
        @InjectRepository(CronRepository)
        private readonly cronRepository: CronRepository,
        ) { }

    async setCronJob(data: CronData) {
        const bullJob = await this.cronQueue.getJob(data.repeatId)
        if(bullJob) {
            console.log(bullJob,'here')
            await bullJob.remove()
        }
       const queueJob = await this.cronQueue.add('cronjob', {
            task: data
        }, {
            jobId: `${data.id}`,
            repeat: { cron:`${data.sec} ${data.minutes} ${data.hour} * * *` },
        })
        await this.cronRepository.updateRepeatId({ id:data.id, repeatId: queueJob.id })
    }

    async checkCronJobs(data: CronData[]) {
        data.forEach(async (job) => {
            const bullJob = await this.cronQueue.getJob(job.repeatId)
            if(bullJob) {
                return
            } else{
                console.log('ammmmmmmmmmmmmmmmmmm')
               const queueJob = await this.cronQueue.add('cronjob', {
                    task: job
                }, {
                    repeat: { cron:`${job.sec} ${job.minutes} ${job.hour} * * *` },
                    jobId:`${job.id}`
                })
                await this.cronRepository.updateRepeatId({ id:job.id, repeatId: queueJob.id })

            }
        })
    }
}