import { job } from "cron";
import { Repository } from "typeorm";
import { getTimesFromDate } from "./cron.service";
import { DateAndJobDto } from "./date.dto";
import { CronJobs } from "./job.entity";
import {JobId} from 'bull'

export class CronRepository extends Repository<CronJobs>{

    async UpdateCronJobTime(dateAndJobDto: DateAndJobDto) {
        try {
            const { date, name } = dateAndJobDto
            const cronTime = new Date(date)
            const cronJob = await CronJobs.findOne({ where: { jobName: name } })
            cronJob.cronTime = cronTime
            await cronJob.save()
            return { changed: true ,id: cronJob.id, repeatId: cronJob.repeatId }
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

    async checkCronJobs() {
        const jobs = await CronJobs.find()
        const cronData =await Promise.all( jobs.map(async (job) => {
            const {sec, minutes, hour} = getTimesFromDate(job.cronTime)
            return { sec, minutes, hour, name: job.jobName, id: job.id, repeatId: job.repeatId}
        }))
        return cronData
    }

    async updateRepeatId(data: {id: number, repeatId: JobId }) {
        const job = await CronJobs.findOne({ where: { id: data.id } })
        job.repeatId = data.repeatId
        await job.save()
    }
}