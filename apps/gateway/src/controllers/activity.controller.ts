import { Controller, Get, Param, Query } from "@nestjs/common";
import { activityPatterns } from "@ns/endpoints";
import { NatsClient } from "@ns/nats";

@Controller("activity")
export class ActivityController {
    constructor(private client: NatsClient) {}

    @Get("count")
    async getActivityCount() {
        return await this.client.request(activityPatterns.getActivityCount);
    }

    @Get(":page/:page-size")
    async getActivities(
        @Param("page") page: string,
        @Param("page-size") pageSize: string
    ) {
        return await this.client.request(activityPatterns.getActivity, {
            page: Number(page),
            pageSize: Number(pageSize),
        });
    }


}
