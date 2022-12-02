import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import * as Mail from 'nodemailer/lib/mailer';
import { CronData } from './cron/cron-data.interface';
import { EmailService } from './email/email.service';

@Processor('email-que')
export class CronConsumer {

    constructor(
        private emailService: EmailService,
    ) { }

    @Process('cronjob')
    async cronjob(job: Job<{ task: CronData }>) {
        try {
            console.log(job)
            const emailDetail: Mail.Options = {
                to: 'mohdaafrin@gmail.com',
                subject: `${job.data.task.hour} ${job.data.task.minutes} id: ${job.data.task.id}`,
                text: `${job.data.task.name}`,
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
        return {}
    }
}
