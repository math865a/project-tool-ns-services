import { Controller } from "@nestjs/common";
import { QueryBus } from "@nestjs/cqrs";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { activityPatterns } from "@ns/endpoints";
import { ActivitiesQuery } from "./queries/activities/activities.query";
import { GetActivitiesQuery } from "@ns/dto";
import { CountQuery } from "./queries/count";

@Controller()
export class ActivityController {
    constructor(private queryBus: QueryBus) {}

    @MessagePattern(activityPatterns.getActivity)
    async getActivity(@Payload() query: GetActivitiesQuery) {
        return await this.queryBus.execute(new ActivitiesQuery(query));
    }

    @MessagePattern(activityPatterns.getActivityCount)
    async getActivityCount() {
        return await this.queryBus.execute(new CountQuery());
    }

}
