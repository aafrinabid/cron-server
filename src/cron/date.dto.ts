import {  IsNotEmpty, IsDateString, IsString} from 'class-validator';


export class DateAndJobDto {
    @IsNotEmpty()
    @IsDateString()
    date:string

    @IsString()
    name: string
}