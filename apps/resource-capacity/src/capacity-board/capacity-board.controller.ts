import { Controller } from "@nestjs/common";
import { QueryBus } from "@nestjs/cqrs";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { CapacityFilterDto } from "@ns/dto";
import { capacityBoardPatterns as patterns } from "@ns/endpoints";
import { CapacityBatchQuery } from "./capacity-batch";
import { ResourceRowsQuery } from "./resource-rows";
import { ResourceTypeRowsQuery } from "./resourcetype-rows";
import { BookingStagesQuery } from "./booking-stages";

@Controller()
export class CapacityBoardNatsController {
    constructor(private queryBus: QueryBus) {}

    @MessagePattern(patterns.getBatch)
    async getBatch(@Payload() dto: CapacityFilterDto) {
        return await this.queryBus.execute(new CapacityBatchQuery(dto));
    }

    @MessagePattern(patterns.getRows)
    async getRows() {
        return await Promise.all([
            this.queryBus.execute(new ResourceRowsQuery()),
            this.queryBus.execute(new ResourceTypeRowsQuery()),
            this.queryBus.execute(new BookingStagesQuery()),
        ]).then((res) => ({
            rows: {
                resources: res[0],
                resourceTypes: res[1],
            },
            bookingStages: res[2],
        }));
    }
}
