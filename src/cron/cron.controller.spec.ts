import { Test, TestingModule } from '@nestjs/testing';
import { EmailService } from 'src/email/email.service';
import { CronProducerService } from './cron-producer.service';
import { CronController } from './cron.controller';
import { CronService } from './cron.service';
import { DateAndJobDto } from './date.dto';
import { CronJobs } from './job.entity';

describe('CronController', () => {
  let controller: CronController;
  let service: CronService;
  let cronjobs: Promise<{ jobs: CronJobs[] }>;
  let cronJob: Promise<CronJobs>;
  let dateAndDto: DateAndJobDto;
  let updateCronTimeResult: Promise<{ changed: boolean }>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CronController],
      providers: [ CronService, CronProducerService, CronProducerService, EmailService]
    }).compile();

    controller = module.get<CronController>(CronController);
    service = module.get<CronService>(CronService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a cron job', async () => {
    jest.spyOn(service,'createCronJob').mockImplementation(()=> cronJob)
    expect( await controller.createCronJob( dateAndDto ) ).toBe( cronJob )
  })

  it('should update the cronjob time', async () => {
    jest.spyOn(service,'changeDateForNotifier').mockImplementation(() => updateCronTimeResult );
    expect( await controller.changeCronTime(dateAndDto)).toBe(updateCronTimeResult);
  })

  it('should get all cron jobs', async () => {
    jest.spyOn(service,'findAllJobs').mockImplementation(() => cronjobs)
    expect(await controller.findAllJobs()).toBe(cronjobs)
  })
});
