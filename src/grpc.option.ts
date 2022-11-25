import { ClientOptions, Transport } from "@nestjs/microservices";
import { join } from "path";

export const grpcClientOptions: ClientOptions = {
    transport: Transport.GRPC,
    options: {
        url:'localhost:50051',
        package:['cronTime'],
        protoPath:[join(__dirname,'./cron/change-cron-time.proto')]
    }
}