import { Controller } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { EventPattern, MessagePattern, Payload } from "@nestjs/microservices";
import { resourcePatterns as patterns } from "@ns/endpoints";
import {
    DeleteResourceCommand,
    CreateResourceCommand,
    UpdateResourceCommand,
} from "./commands";
import { CreateResourceDto, UpdateResourceDto } from "@ns/dto";
import {
    ResourceOptionsQuery,
    ResourceProfileQuery,
    ResourcesViewQuery,
} from "./queries";
import { UserCreatedEvent } from "@ns/events";

@Controller()
export class ResourceNatsController {
    constructor(private queryBus: QueryBus, private commandBus: CommandBus) {}

    @MessagePattern(patterns.deleteResource)
    async deleteResource(
        @Payload("id") id: string,
        @Payload("uid") uid: string
    ) {
        return await this.commandBus.execute(
            new DeleteResourceCommand(id, uid)
        );
    }

    @MessagePattern(patterns.createResource)
    async createResource(
        @Payload("dto") dto: CreateResourceDto,
        @Payload("uid") uid: string
    ) {
        return await this.commandBus.execute(
            new CreateResourceCommand(dto, uid)
        );
    }

    @MessagePattern(patterns.updateResource)
    async updateResource(
        @Payload("dto") dto: UpdateResourceDto,
        @Payload("uid") uid: string
    ) {
        return await this.commandBus.execute(
            new UpdateResourceCommand(dto, uid)
        );
    }

    @MessagePattern(patterns.getResourceProfile)
    async getResourceProfile(resourceId: string) {
        return await this.queryBus.execute(
            new ResourceProfileQuery(resourceId)
        );
    }

    @MessagePattern(patterns.getResourcesView)
    async getResourcesView() {
        return await this.queryBus.execute(new ResourcesViewQuery());
    }

    @MessagePattern(patterns.getResourceOptions)
    async getResourceOptions() {
        return await this.queryBus.execute(new ResourceOptionsQuery());
    }

    @EventPattern(UserCreatedEvent.name)
    async onUserCreated(event: UserCreatedEvent) {
        if (event.body.isResource && event.body.connect === "Ingen" && event.body.resourceDto) {
            const dto = {
                ...event.body.resourceDto,
                id: event.body.uid,
                name: event.body.name,
                color: event.body.color,
            };

            await this.commandBus.execute(
                new CreateResourceCommand(dto, event.uid)
            );
        }
    }
}
