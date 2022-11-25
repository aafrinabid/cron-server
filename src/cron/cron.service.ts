import { Injectable } from '@nestjs/common';
import { SchedulerRegistry, Timeout } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { CronRepository } from './cron.repository';
import { DateAndJobDto } from './date.dto';
import { CronJobs } from './job.entity';
import * as Mail from 'nodemailer/lib/mailer';
import { EmailService } from 'src/email/email.service';
import { CronJob, CronTime } from 'cron';

@Injectable()
export class CronService {

    constructor(
        private emailService: EmailService,
        private scheduleRegistry: SchedulerRegistry,
        @InjectRepository(CronRepository)
        private readonly cronRepository: CronRepository,
    ) { }

    async scheduleMailForNotifier(): Promise<void> {
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

    @Timeout(1000)
    async runCronJob(): Promise<void> {
        try {
            console.log('running for cronjobs')
            const cronJobs: { jobs: CronJobs[] } = await this.cronRepository.fetchAllJobs()
            cronJobs.jobs.forEach(async (job) => {
                const cronTime = new Date(job.cronTime)
                const { sec, minutes, hour } = getTimesFromDate(cronTime)
                const cronJob = new CronJob(`${sec} ${minutes} ${hour} * * *`, async () => {
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
                })
                this.scheduleRegistry.addCronJob(job.jobName, cronJob)
                cronJob.start()
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
            const job1 = this.scheduleRegistry.getCronJob(name)
            job1.setTime(new CronTime(`${sec} ${minutes} ${hour} * * *`))
            return await this.cronRepository.UpdateCronJobTime(dateAndJobDto)
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
            const cronJob = new CronJob(`${sec} ${minutes} ${hour} * * *`, async () => {
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
            )
            this.scheduleRegistry.addCronJob(name, cronJob)
            cronJob.start()
            return await this.cronRepository.createCronJob(dateAndJobDto)
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