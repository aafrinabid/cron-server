import { Repository } from "typeorm";
import { DateAndJobDto } from "./date.dto";
import { CronJobs } from "./job.entity";

export class CronRepository extends Repository<CronJobs>{

    async UpdateCronJobTime(dateAndJobDto: DateAndJobDto) {
        try {
            const { date, name } = dateAndJobDto
            const cronTime = new Date(date)
            const cronJob = await CronJobs.findOne({ where: { jobName: name } })
            cronJob.cronTime = cronTime
            await cronJob.save()
            return { changed: true ,id: cronJob.id }
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

    async getTimeForCronJob(name: string) {
        try {
            const job = await CronJobs.findOne({ where: { jobName: name } })
            return job.cronTime
        } catch (e) {
            console.log(e)
        }
    }

    async createCronJob(dateAndJobDto: DateAndJobDto) {
        const { date, name } = dateAndJobDto
        const cronTime = new Date(date)
        const cronJob = new CronJobs
        cronJob.jobName = name
        cronJob.cronTime = cronTime
        await cronJob.save()
        return cronJob
    }
}