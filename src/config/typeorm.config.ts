import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { CronJobs } from "../cron/job.entity";

export const typeOrmConfig : TypeOrmModuleOptions={
    type:'postgres',
    host:'localhost',
    port:5432,
    username:'postgres',
    password:'postgres',
    database:'taskmanagement',
    entities: [CronJobs],
    synchronize:true

}