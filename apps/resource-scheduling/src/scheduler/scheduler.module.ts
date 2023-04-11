import { Module } from "@nestjs/common";
import { SchedulerController } from "./scheduler.controller";
import { SyncBookingsHandler } from "./sync-bookings/sync-bookings.handler";

@Module({
    providers: [SyncBookingsHandler],
    controllers: [SchedulerController],
})
export class SchedulerModule {}
