import { Controller, Get, Param } from "@nestjs/common";
import { HttpUser } from "@ns/decorators";
import { SummaryView } from "@ns/definitions";
import { schedulePatterns } from "@ns/endpoints";
import { NatsClient } from "@ns/nats";

@Controller("schedule")
export class SchduleController {
    constructor(private client: NatsClient) {}

    @Get("summary/:view")
    async getSummary(
        @Param("view") view: SummaryView,
        @HttpUser() uid: string
    ) {
        return await this.client.request(schedulePatterns.getSummaryTasks, {
            view,
            uid,
        });
    }

    @Get("calendar/:id/:start/:end")
    async getSchedule(
        @Param("start") start: string,
        @Param("end") end: string,
        @Param("id") id: string
    ) {
        return await this.client.request(schedulePatterns.getSchedule, {
            start,
            end,
            id
        });
    }

    @Get("tasks/:id/:start/:end")
    async getTasks(
        @Param("id") id: string,
        @Param("start") start: string,
        @Param("end") end: string
    ) {
        return await this.client.request(schedulePatterns.getTasks, {
            start,
            end,
            id,
        });
    }
}
