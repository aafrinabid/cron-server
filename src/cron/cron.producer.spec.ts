import { Test, TestingModule } from "@nestjs/testing"
import { CronProducerService } from "./cron-producer.service"
import { BullModule } from '@nestjs/bull';
import { CronData } from "./cron-data.interface";
import { CronRepository } from "./cron.repository";

describe('CronProducerService', () => {
    let service: CronProducerService
    let mockRepository: CronRepository
    let cronData: CronData = {
        id: 1,
        name: 'reminder',
        hour: 1,
        sec: 1,
        minutes: 1,
        repeatId:'1'
    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [BullModule.registerQueue({
                name: 'email-que',
            }),],
            providers: [CronProducerService, CronRepository]
        }).compile();

        service = module.get<CronProducerService>(CronProducerService)
        mockRepository = module.get<CronRepository>(CronRepository)

    })

    it('should be defined', async () => {
        expect(service).toBeDefined()
    })

    it('should add the job to que', async () => {
        let producerSerivceResult: Promise<void>
        jest.spyOn(mockRepository,'updateRepeatId').mockImplementation(() => producerSerivceResult)
        expect(await service.setCronJob(cronData)).toBe(producerSerivceResult)
    })

})