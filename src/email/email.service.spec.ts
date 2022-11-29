import { Test, TestingModule } from '@nestjs/testing';
import { EmailService } from './email.service';
import * as Mail from 'nodemailer/lib/mailer';

describe('EmailService', () => {
  let service: EmailService;
  let mailTransport : Mail;
  let options: Mail.Options;
  let emailSentDetails: Promise<boolean>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmailService],
    }).compile();

    service = module.get<EmailService>(EmailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should send mail', async () => {
    expect(service.sendMail(options)).toBe(emailSentDetails)    
  })
});
