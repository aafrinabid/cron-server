import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { JobId } from 'bull'

@Entity()
export class CronJobs extends BaseEntity {
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    jobName: string;

    @Column()
    cronTime: Date;

    @Column({nullable:true})
    repeatId: string
}