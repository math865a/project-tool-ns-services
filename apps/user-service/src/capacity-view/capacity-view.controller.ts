import { Controller } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { MessagePattern, Payload } from "@nestjs/microservices";
import {
    CreateCapacityViewDto,
    UpdateCapacityViewDto,
    UpdateCapacityViewNameDto,
    UpdateDefaultCapacityViewDto,
} from "@ns/dto";
import { capacityViewPatterns as patterns } from "@ns/endpoints";
import {
    CreateCapacityViewCommand,
    UpdateDefaultCapacityViewCommand,
    UpdateCapacityViewCommand,
    UpdateCapacityViewNameCommand,
    DeleteCapacityViewCommand,
} from "./commands";
import { CapacityViewsQuery } from "./queries";

@Controller()
export class CapacityViewNatsController {
    constructor(private commandBus: CommandBus, private queryBus: QueryBus) {}

    @MessagePattern(patterns.createCapacityView)
    async createCapacityView(
        @Payload("dto") dto: CreateCapacityViewDto,
        @Payload("uid") uid: string
    ) {
        return await this.commandBus.execute(
            new CreateCapacityViewCommand(dto, uid)
        );
    }

    @MessagePattern(patterns.updateDefaultCapacityView)
    async updateDefaultCapacityView(
        @Payload("dto") dto: UpdateDefaultCapacityViewDto,
        @Payload("uid") uid: string
    ) {
        return await this.commandBus.execute(
            new UpdateDefaultCapacityViewCommand(dto, uid)
        );
    }

    @MessagePattern(patterns.updateCapacityView)
    async updateCapacityView(
        @Payload("dto") dto: UpdateCapacityViewDto,
        @Payload("uid") uid: string
    ) {
        return await this.commandBus.execute(
            new UpdateCapacityViewCommand(dto, uid)
        );
    }

    @MessagePattern(patterns.updateCapacityViewName)
    async updateCapacityViewName(
        @Payload("dto") dto: UpdateCapacityViewNameDto,
        @Payload("uid") uid: string
    ) {
        return await this.commandBus.execute(
            new UpdateCapacityViewNameCommand(dto, uid)
        );
    }

    @MessagePattern(patterns.getCapacityViews)
    async getCapacityViews(uid: string) {
        return await this.queryBus.execute(new CapacityViewsQuery(uid));
    }

    @MessagePattern(patterns.deleteCapacityView)
    async deleteCapacityView(
        @Payload("viewId") viewId: string,
        @Payload("uid") uid: string
    ) {
        return await this.commandBus.execute(
            new DeleteCapacityViewCommand(viewId, uid)
        );
    }
}
