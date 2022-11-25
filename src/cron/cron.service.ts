import { Injectable } from '@nestjs/common';
import { Cron, SchedulerRegistry, Timeout } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { CronRepository } from './cron.repository';
import { DateAndJobDto } from './date.dto';
import { CronJob } from './job.entity';
import * as Mail from 'nodemailer/lib/mailer';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class CronService {
    constructor(
        @InjectRepository(CronRepository)
        private readonly cronRepository: CronRepository,
        private scheduleRegistry: SchedulerRegistry,
        private emailService: EmailService
    ) { }

    @Cron('* */30 2 * * *', {
        name: 'notifier1'
    })
    async scheduleMailForNotifier1() :Promise<void>{
        try {
            const emailDetail: Mail.Options = {
                to: 'mohdaafrin@gmail.com',
                subject: 'hello world',
                text: 'hello world',
                from: 'mohdaafrin@outlook.com'
            }
            const emailSent = await this.emailService.sendMail(emailDetail)
            if (emailSent) {
                console.log('mail sent')
            } else {
                console.log('mail not sent')
            }
        } catch (e) {
            console.log(e)
        }
    }

    @Cron('* */15 17 * * *', {
        name:'notifier2'
    })
    async scheduleMailForNotfier2() {
        this.scheduleMailForNotifier1()
    }

    @Timeout(1000)
    runCronJob() {
        try{
            const cronJobs = ['notifier1','notifier2']
            cronJobs.forEach(async (job) => {
                const cronJob = this.scheduleRegistry.getCronJob(job)
                const cronTime = await this.cronRepository.getTimeForCronJob(job)
                const { sec, minutes, hour } = getTimesFromDate(cronTime)
                cronJob.setTime(`*/${sec} */${minutes} */${hour} * * *`)
            })
        }catch(e){
            console.log(e)
        }
      
    }

    async changeDateForNotifier(dateAndJobDto: DateAndJobDto) {
        try {
            const { date, name } = dateAndJobDto
            const cronDate = new Date(date)
            const { sec, minutes, hour } = getTimesFromDate(cronDate)
            const job1 = this.scheduleRegistry.getCronJob(name)
            job1.setTime(`*/${sec} */${minutes} */${hour} * * *`)
            return await this.cronRepository.UpdateCronJobTime(dateAndJobDto)
        } catch (e) {
            console.log(e)
        }
    }

    async findAllJobs(): Promise<CronJob[]> {
        try {
            return await this.cronRepository.fetchAllJobs()
        } catch (e) {
            console.log(e)
        }
    }

    async createCronJob(dateAndJobDto: DateAndJobDto) {
        try {
            return this.cronRepository.createCronJob(dateAndJobDto)
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