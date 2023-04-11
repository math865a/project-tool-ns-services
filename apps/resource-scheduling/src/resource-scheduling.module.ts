import { Module } from "@nestjs/common";
import { ServiceModule } from "@ns/service-deps";
import { SchedulerModule } from "./scheduler/scheduler.module";
import { CalendarModule } from "./calendar/calendar.module";

@Module({
    imports: [ServiceModule, SchedulerModule, CalendarModule],
})
export class ResourceSchedulingModule {}
