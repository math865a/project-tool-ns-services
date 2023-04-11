import { Controller } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { CreateResourceTypeDto, UpdateResourceTypeDto } from "@ns/dto";
import { resourceTypePatterns as patterns } from "@ns/endpoints";
import { CreateResourceTypeCommand, DeleteResourceTypeCommand, UpdateResourceTypeCommand } from "./commands";
import { ResourceTypeOptionsQuery, ResourceTypeProfileQuery, ResourceTypesViewQuery } from "./queries";

@Controller()
export class ResourceTypeNastController {
    constructor(private queryBus: QueryBus, private commandBus: CommandBus) {}

    @MessagePattern(patterns.deleteResourceType)
    async deleteResourceType(
        @Payload("resourceTypeId") resourceTypeId: string,
        @Payload("uid") uid: string
    ) {
        return await this.commandBus.execute(
            new DeleteResourceTypeCommand(resourceTypeId, uid)
        );
    }

    @MessagePattern(patterns.createResourceType)
    async createResourceType(
        @Payload("dto") dto: CreateResourceTypeDto,
        @Payload("uid") uid: string
    ) {
        return await this.commandBus.execute(
            new CreateResourceTypeCommand(dto, uid)
        );
    }

    @MessagePattern(patterns.updateResourceType)
    async updateResourceType(
        @Payload("dto") dto: UpdateResourceTypeDto,
        @Payload("uid") uid: string
    ) {
        return await this.commandBus.execute(
            new UpdateResourceTypeCommand(dto, uid)
        );
    }

    @MessagePattern(patterns.getResourceTypeOptions)
    async getResourceTypeOptions() {
        return await this.queryBus.execute(new ResourceTypeOptionsQuery());
    }

    @MessagePattern(patterns.getResourceTypeProfile)
    async getResourceTypeProfile(resourceTypeId: string) {
        return await this.queryBus.execute(
            new ResourceTypeProfileQuery(resourceTypeId)
        );
    }

    @MessagePattern(patterns.getResourceTypesView)
    async getResourceTypesView() {
        return await this.queryBus.execute(new ResourceTypesViewQuery());
    }
}
