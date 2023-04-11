import { Module } from "@nestjs/common";
import { ServiceModule } from "@ns/service-deps";
import { CapacityBoardModule } from "./capacity-board/capacity-board.module";
import { ResourceScheduleModule } from "./resource-schedule/resource-schedule.module";

@Module({
    imports: [ServiceModule, CapacityBoardModule, ResourceScheduleModule],
})
export class ResourceCapacityModule {}
