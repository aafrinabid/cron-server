import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class CronJob extends BaseEntity {
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    jobName: string;

    @Column()
    cronTime: Date;
}