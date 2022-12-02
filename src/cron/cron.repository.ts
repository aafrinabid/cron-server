import { job } from "cron";
import { Repository } from "typeorm";
import { getTimesFromDate } from "./cron.service";
import { DateAndJobDto } from "./date.dto";
import { CronJobs } from "./job.entity";
import { JobId } from 'bull'
import { CronUpdateResult } from "./update-cron.interface";

export class CronRepository extends Repository<CronJobs>{

    async UpdateCronJobTime(dateAndJobDto: DateAndJobDto): Promise<CronUpdateResult> {
        try {
            const { date, name } = dateAndJobDto
            const cronTime = new Date(date)
            const cronJob = await CronJobs.findOne({ where: { jobName: name } })
            cronJob.cronTime = cronTime
            await cronJob.save()
            return { changed: true, id: cronJob.id, repeatId: cronJob.repeatId }
        } catch (e) {
            console.log(e)
        }
    }

    async fetchAllJobs(): Promise<{ jobs: CronJobs[] }> {
        try {
            const cronJobs = await CronJobs.find()
            return { jobs: cronJobs }
        } catch (e) {
            console.log(e)
        }
    }

    async createCronJob(dateAndJobDto: DateAndJobDto): Promise<CronJobs> {
        try {
            const { date, name } = dateAndJobDto
            const cronTime = new Date(date)
            const cronJob = new CronJobs
            cronJob.jobName = name
            cronJob.cronTime = cronTime
            await cronJob.save()
            return cronJob
        } catch (e) {
            console.log(e)
        }
    }

    async updateRepeatId(data: { id: number, repeatId: JobId }): Promise<void> {
        try {
            const job = await CronJobs.findOne({ where: { id: data.id } })
            job.repeatId = data.repeatId
            await job.save()
        } catch (e) {
            console.log(e)
        }
    }
}