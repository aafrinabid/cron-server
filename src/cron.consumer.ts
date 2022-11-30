import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import * as Mail from 'nodemailer/lib/mailer';
import { EmailService } from './email/email.service';

@Processor('email-que')
export class CronConsumer {

    constructor(
        private emailService: EmailService,
    ) { }

    @Process('cronjob')
    async cronjob(job: Job<{ task: { id: number, name: string, hour: number, sec: number, minutes: number } }>) {
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
        return {}
    }
}
