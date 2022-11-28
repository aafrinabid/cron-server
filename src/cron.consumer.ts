import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { CronJob } from 'cron';
import { SchedulerRegistry } from '@nestjs/schedule';
import * as Mail from 'nodemailer/lib/mailer';
import { EmailService } from './email/email.service';

@Processor('email-que')
export class CronConsumer {

    constructor(
        private emailService: EmailService,
        private scheduleRegistry: SchedulerRegistry,
        ){}

    @Process('cronjob')
    async cronjob(job: Job<{task:{id: number, name: string, hour: number , sec: number , minutes: number}}>) {
        const {sec, minutes, hour, name} = job.data.task
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
        return {}
    }
}
 