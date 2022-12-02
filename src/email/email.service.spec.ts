import { Test, TestingModule } from '@nestjs/testing';
import { EmailService } from './email.service';
import * as Mail from 'nodemailer/lib/mailer';
import {ConfigModule} from '@nestjs/config'
import {ConfigService} from '@nestjs/config'

describe('EmailService', () => {
  let service: EmailService;
  let options: Mail.Options;
  let emailSentDetails: Promise<boolean>;
  let configService: ConfigService
 
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports:[ConfigModule],
      providers: [EmailService, ConfigService],
    }).compile();

    service = module.get<EmailService>(EmailService);
    configService = module.get<ConfigService>(ConfigService)
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should send mail', async () => {
    expect(await service.sendMail(options)).toBe(emailSentDetails)
  })
  
});
