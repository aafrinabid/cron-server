import { Test, TestingModule } from "@nestjs/testing"
import { CronConsumer } from "./cron.consumer"
import { EmailService } from "./email/email.service"
import { ConfigModule } from '@nestjs/config'
import { ConfigService } from '@nestjs/config'
import { Job } from 'bull';
import { CronData } from "./cron/cron-data.interface"

describe('CronConsumer', () => {
    let service: CronConsumer
    let emailService: EmailService
    let job: Job<{task: CronData }>

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [ConfigModule],
            providers: [EmailService, CronConsumer, ConfigService]
        }).compile()

        service = module.get<CronConsumer>(CronConsumer)
        emailService = module.get<EmailService>(EmailService)
    })

    it('should be definced', async () => {
        expect(service).toBeDefined()
    })

    it('should consume the queues', async () => {
        let result: Promise<{consumed: boolean}>
        let emailSentStatus: Promise<boolean>
        jest.spyOn(emailService, 'sendMail').mockImplementation(() => emailSentStatus)
        expect(await service.cronjob(job)).toEqual(result)
    })
    
})