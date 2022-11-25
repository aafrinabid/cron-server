import { Repository } from "typeorm";
import { DateAndJobDto } from "./date.dto";
import { CronJob } from "./job.entity";
export class CronRepository extends Repository<CronJob>{

    async UpdateCronJobTime(dateAndJobDto: DateAndJobDto) {
        try{
            const {date, name} = dateAndJobDto
            const cronTime = new Date(date)
            const cronJob = await CronJob.findOne({where:{jobName: name}})
            cronJob.cronTime = cronTime
            await cronJob.save()
            return {changed: true}
        }catch(e){
            console.log(e)
        }
    }

    async fetchAllJobs() : Promise<CronJob[]>{
        try{
            return await CronJob.find()
        }catch(e){
            console.log(e)
        }
    }

    async getTimeForCronJob(name: string) {
        try{
            const job = await CronJob.findOne({where:{jobName: name}})
            return job.cronTime
        }catch(e){

        }
    }

    async createCronJob(dateAndJobDto : DateAndJobDto) {
        const {date, name} = dateAndJobDto
        const cronTime = new Date(date)
        console.log(cronTime)
        const cronJob = new CronJob
        cronJob.jobName = name
        cronJob.cronTime = cronTime
        await cronJob.save()
        return cronJob
    }
}