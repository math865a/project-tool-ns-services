import { Module } from "@nestjs/common";
import { EventLoggerModule } from "./event-logger/event-logger.module";
import { MongooseModule } from "@nestjs/mongoose";

@Module({
    imports: [EventLoggerModule],
})
export class MonitoringModule {}
