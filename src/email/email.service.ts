import { Injectable } from '@nestjs/common';
import { createTransport } from 'nodemailer';
import * as Mail from 'nodemailer/lib/mailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
    private nodemailerTransport: Mail;

    constructor(
        private readonly configService: ConfigService
    ) {
        this.nodemailerTransport = createTransport({
            service: this.configService.get('emailService'),
            port: 587,
            host: 'smtp.office365.com',
            auth: {
                user: this.configService.get('user.email'),
                pass: this.configService.get('user.password')
            },
            pool: true,
            maxConnections: 3
        })
    }

    async sendMail(options: Mail.Options): Promise<boolean> {
        try {
            const result = await this.nodemailerTransport.sendMail(options)
            if (result.rejected.length < 1) {
                return true
            } else {
                return false
            }
        } catch (e) {
            console.log(e)
        }
    }
}
