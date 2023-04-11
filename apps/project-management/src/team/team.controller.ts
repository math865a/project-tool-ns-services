import { Controller } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { teamPatterns as patterns } from "@ns/endpoints";
import {
    AddTeamMemberCommand,
    RemoveTeamMemberCommand,
    SwapTeamMemberCommand,
} from "./commands";
import {
    AddTeamMemberDto,
    RemoveTeamMemberDto,
    SwapTeamMemberDto,
} from "@ns/dto";
import { WorkpackageTeamQuery } from "./queries";

@Controller()
export class TeamNatsController {
    constructor(private queryBus: QueryBus, private commandBus: CommandBus) {}

    @MessagePattern(patterns.addTeamMember)
    async addTeamMember(
        @Payload("dto") dto: AddTeamMemberDto,
        @Payload("uid") uid: string
    ) {
        return await this.commandBus.execute(
            new AddTeamMemberCommand(dto, uid)
        );
    }

    @MessagePattern(patterns.removeTeamMember)
    async removeTeamMember(
        @Payload("dto") dto: RemoveTeamMemberDto,
        @Payload("uid") uid: string
    ) {
        return await this.commandBus.execute(
            new RemoveTeamMemberCommand(dto, uid)
        );
    }

    @MessagePattern(patterns.swapTeamMember)
    async swapTeamMember(
        @Payload("dto") dto: SwapTeamMemberDto,
        @Payload("uid") uid: string
    ) {
        return await this.commandBus.execute(
            new SwapTeamMemberCommand(dto, uid)
        );
    }

    @MessagePattern(patterns.getWorkpackageTeam)
    async getWorkpackageTeam(workpackageId: string) {
        return await this.queryBus.execute(
            new WorkpackageTeamQuery(workpackageId)
        );
    }
}
