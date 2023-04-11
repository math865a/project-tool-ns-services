import { Module } from "@nestjs/common";
import { EventLoggerModule } from "./event-logger/event-logger.module";

@Module({
    imports: [EventLoggerModule]
})
export class MonitoringModule {}