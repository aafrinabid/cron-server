import { Test, TestingModule } from "@nestjs/testing"
import { CronProducerService } from "./cron-producer.service"
import { BullModule } from '@nestjs/bull';

interface CronData { id: number, name: string, hour: number, sec: number, minutes: number }

describe('CronProducerService', () => {
    let service: CronProducerService
    let cronData: CronData = {
        id: 1,
        name: 'reminder',
        hour: 1,
        sec: 1,
        minutes: 1,
    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [BullModule.registerQueue({
                name: 'email-que',
            }),],
            providers: [CronProducerService]
        }).compile();

        service = module.get<CronProducerService>(CronProducerService)
    })

    it('should be defined', async () => {
        expect(service).toBeDefined()
    })

    it('should add the job to que', async () => {
        let producerSerivceResult: Promise<void>
        expect(await service.setCronJob(cronData)).toBe(producerSerivceResult)
    })
})