import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class CronJobs extends BaseEntity {
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    jobName: string;

    @Column()
    cronTime: Date;
}