import { Controller, Get } from "@nestjs/common";
import { HttpUser } from "@ns/decorators";
import { capacityBoardPatterns, capacityViewPatterns } from "@ns/endpoints";
import { NatsClient } from "@ns/nats";

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
}
