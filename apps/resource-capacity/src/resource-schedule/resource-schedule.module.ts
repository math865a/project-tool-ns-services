import { Module } from "@nestjs/common";
import { queryHandlers } from "./queries";
import { ScheduleNatsController } from "./resource-schedule.controller";

@Module({
    controllers: [ScheduleNatsController],
    providers: [...queryHandlers],
})
export class ResourceScheduleModule {}
