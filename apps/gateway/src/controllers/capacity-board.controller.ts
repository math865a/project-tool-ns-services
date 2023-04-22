import { Controller, Get, Param } from "@nestjs/common";
import { HttpUser } from "@ns/decorators";
import {
    capacityBoardPatterns,
    capacityViewPatterns,
    schedulePatterns,
} from "@ns/endpoints";
import { NatsClient } from "@ns/nats";
import { DateTime as dt } from "luxon";

@Controller("capacity-board")
export class CapacityBoardController {
    constructor(private client: NatsClient) {}

    @Get("rows")
    async getRows(@HttpUser() uid: string) {
        return Promise.all([
            this.client.request(capacityBoardPatterns.getRows),
            this.client.request(capacityViewPatterns.getCapacityViews, uid),
        ]).then((res) => ({
            ...(res[0] as Object),
            views: res[1],
        }));
    }

    @Get(":rowId/:startDate/:endDate")
    async getDetail(
        @Param("rowId") rowId: string,
        @Param("startDate") startDate: string,
        @Param("endDate") endDate: string
    ) {
        const dto = {
            resourceId: rowId,
            startDate: startDate,
            endDate: dt.fromISO(endDate).minus({ days: 1 }).toISODate(),
        };
        return await this.client.request(
            schedulePatterns.getWorkpackageTotals,
            dto
        );
    }
}
