import { SchedulerRegistry } from '@nestjs/schedule';
import { Test, TestingModule } from '@nestjs/testing';
import { CronJob} from 'cron';
import { CronProducerService } from './cron-producer.service';
import { CronRepository } from './cron.repository';
import { CronService } from './cron.service';
import { DateAndJobDto } from './date.dto';
import { CronJobs } from './job.entity';
import { BullModule } from '@nestjs/bull'
import { CronUpdateResult } from './update-cron.interface';

describe('CronService', () => {
  let service: CronService;
  let mockRepository: CronRepository;
  let scheduleRegistry: SchedulerRegistry;
  let cronProducerService: CronProducerService;
  let dateAndDto: DateAndJobDto
  let producerServiceResult: Promise<void>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [BullModule.registerQueue({
        name: 'email-que',
      }),],
      providers: [CronService, CronRepository, SchedulerRegistry, CronProducerService],
    }).compile();

    service = module.get<CronService>(CronService);
    mockRepository = module.get<CronRepository>(CronRepository);
    scheduleRegistry = module.get<SchedulerRegistry>(SchedulerRegistry);
    cronProducerService = module.get<CronProducerService>(CronProducerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should run should run cron jobs', async () => {
    let cronJobs: Promise<{ jobs: CronJobs[] }>
    let runCronJobResult: Promise<void>
    jest.spyOn(mockRepository, 'fetchAllJobs').mockImplementation(async () => cronJobs)
    expect(await service.runCronJob()).toBe(runCronJobResult)
  })

  it('should change the reminder date', async () => {
    let cronJob: CronJob;
    let mockRepoResult: Promise<CronUpdateResult>
    jest.spyOn(scheduleRegistry, 'getCronJob').mockImplementation(() => cronJob)
    jest.spyOn(mockRepository, 'updateCronJobTime').mockImplementation(() => mockRepoResult)
    expect(await service.changeDateForNotifier(dateAndDto)).toBe(mockRepoResult)
  })

  it('should create a new cronjob', async () => {
    let cronData: Promise<CronJobs>;
    jest.spyOn(mockRepository, 'createCronJob').mockImplementation(() => cronData)
    jest.spyOn(cronProducerService, 'setCronJob').mockImplementation(() => producerServiceResult)
    expect(await service.createCronJob(dateAndDto)).toBe(cronData)
  })

  it('it should fetch all jobs', async () => {
    let cronJobs: Promise<{ jobs: CronJobs[] }>
    jest.spyOn(mockRepository, 'fetchAllJobs').mockImplementation(() => cronJobs)
    expect(await service.findAllJobs()).toBe(cronJobs)
  })
  
});
