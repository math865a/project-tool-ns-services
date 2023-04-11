import { Controller, UsePipes } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { PipedUpsertAccessGroupDto } from "@ns/dto";
import { accessGroupPatterns as patterns } from "@ns/endpoints";
import { CreateAccessGroupCommand, DeleteAccessGroupCommand } from "./commands";
import { UpdateAccessGroupCommand } from "./commands/update-access-group/update-access-group.command";
import { PermissionsPipe } from "./pipes";
import { AccessGroupsViewQuery } from "./queries/access-groups-view/access-groups-view.query";
import { AccessGroupOptionsQuery } from "./queries";

@Controller()
export class AccessGroupsController {
    constructor(private commandBus: CommandBus, private queryBus: QueryBus) {}


    @UsePipes(new PermissionsPipe())
    @MessagePattern(patterns.createAccessGroup)
    async createAccessGroup(
        @Payload() payload: {dto: PipedUpsertAccessGroupDto, uid: string},

    ) {
        return await this.commandBus.execute(
            new CreateAccessGroupCommand(payload.dto, payload.uid)
        );
    }

    @UsePipes(new PermissionsPipe())
    @MessagePattern(patterns.updateAccessGroup)
    async updateAccessGroup(
        @Payload() payload: {dto: PipedUpsertAccessGroupDto, uid: string},
    ) {
        return await this.commandBus.execute(
            new UpdateAccessGroupCommand(payload.dto, payload.uid)
        );
    }

    @MessagePattern(patterns.deleteAccessGroup)
    async deleteAccessGroup(
        @Payload("id") id: string,
        @Payload("uid") uid: string
    ) {
        return await this.commandBus.execute(
            new DeleteAccessGroupCommand(id, uid)
        );
    }

    @MessagePattern(patterns.getAccessGroupsView)
    async getAccessGroupsView() {
        return await this.queryBus.execute(new AccessGroupsViewQuery());
    }

    @MessagePattern(patterns.getAccessGroupOptions)
    async getAccessGroupOptions() {
        return await this.queryBus.execute(new AccessGroupOptionsQuery());
    }
}
