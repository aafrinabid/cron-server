import { SchedulerRegistry } from '@nestjs/schedule';
import { Test, TestingModule } from '@nestjs/testing';
import { CronJob, CronTime, job } from 'cron';
import { CronProducerService } from './cron-producer.service';
import { CronRepository } from './cron.repository';
import { CronService } from './cron.service';
import { DateAndJobDto } from './date.dto';
import { CronJobs } from './job.entity';


describe('CronService', () => {
  let service: CronService;
  let mockRepository: CronRepository;
  let scheduleRegistry: SchedulerRegistry;
  let cronProducerService: CronProducerService;
  let dateAndDto: DateAndJobDto
  let producerServiceResult: Promise<void>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ CronService, CronRepository, SchedulerRegistry ],
    }).compile();

    service = module.get<CronService>(CronService);
    mockRepository = module.get<CronRepository>(CronRepository);
    scheduleRegistry = module.get<SchedulerRegistry>(SchedulerRegistry)
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should run should run cron jobs',async () => {
    let cronJobs: Promise< { jobs: CronJobs[] }>
    let runCronJobResult: Promise<void>
    jest.spyOn(mockRepository,'fetchAllJobs').mockImplementation(async()=>cronJobs)
    ;(await cronJobs).jobs.forEach(async(job)=> {
      jest.spyOn(cronProducerService,'setCronJob').mockImplementation(()=> producerServiceResult)
    })
    expect(await service.runCronJob()).toBe(runCronJobResult)
    })

    it('should change the reminder date', async () => {
      let cronJob: CronJob;
      let mockRepoResult: Promise< {changed: boolean} >
      jest.spyOn(scheduleRegistry,'getCronJob').mockImplementation(()=>cronJob)
      cronJob.setTime(new CronTime(dateAndDto.date))
      jest.spyOn(mockRepository,'UpdateCronJobTime').mockImplementation(()=>mockRepoResult)
      expect(await service.changeDateForNotifier(dateAndDto)).toBe(mockRepoResult)
    })

    it('should create a new cronjob', async () => {
      let cronData: Promise<CronJobs>;
      jest.spyOn(mockRepository,'createCronJob').mockImplementation(()=> cronData)
      jest.spyOn(cronProducerService,'setCronJob').mockImplementation(()=>producerServiceResult)
      expect(await service.createCronJob(dateAndDto)).toBe(cronData)
    })

    it('it should fetch all jobs', async () => {
      let cronJobs: Promise< { jobs: CronJobs[] }>
      jest.spyOn(mockRepository,'fetchAllJobs').mockImplementation(()=> cronJobs )
      expect(await service.findAllJobs()).toBe(() => cronJobs )
    })
    
});
