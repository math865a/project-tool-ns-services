import { Module } from "@nestjs/common";
import { BookingStagesHandler } from "./booking-stages";
import { CapacityBatchQueryHandler } from "./capacity-batch";
import { CapacityBoardNatsController } from "./capacity-board.controller";
import { ResourceRowsQueryHandler } from "./resource-rows";
import { ResourceTypeRowsQueryHandler } from "./resourcetype-rows";

@Module({
    providers: [
        CapacityBatchQueryHandler,
        ResourceRowsQueryHandler,
        ResourceTypeRowsQueryHandler,
        BookingStagesHandler,
    ],
    controllers: [CapacityBoardNatsController],
})
export class CapacityBoardModule {}
