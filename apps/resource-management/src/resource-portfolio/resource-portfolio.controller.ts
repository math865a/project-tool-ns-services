import { Controller } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { EventPattern, MessagePattern, Payload } from "@nestjs/microservices";
import { resourcePortfolioPatterns as patterns } from "@ns/endpoints";
import { CreateAgentCommand, DeleteAgentCommand } from "./commands";
import { CreateAgentDto } from "@ns/dto";
import {
    DeleteAgentConsequencesQuery,
    ResourceTypeAgentsQuery,
    TeamOptionsQuery,
} from "./queries";
import { ResourceAgentsQuery } from "./queries/resource-agents/resource-agents.query";
import { ResourceCreatedEvent, ResourceRemovedEvent, UserCreatedEvent } from "@ns/events";
import { DeleteOrphanAgentsCommand } from "./commands/delete-orphan-agents";

@Controller()
export class ResourcePortfolioNastController {
    constructor(private queryBus: QueryBus, private commandBus: CommandBus) {}

    @MessagePattern(patterns.createAgent)
    async createAgent(
        @Payload("dto") dto: CreateAgentDto,
        @Payload("uid") uid: string
    ) {
        return await this.commandBus.execute(new CreateAgentCommand(dto, uid));
    }

    @MessagePattern(patterns.deleteAgent)
    async deleteAgent(
        @Payload("agentId") agentId: string,
        @Payload("uid") uid: string
    ) {
        return await this.commandBus.execute(
            new DeleteAgentCommand(agentId, uid)
        );
    }

    @MessagePattern(patterns.getResourceAgents)
    async getResourceAgents(resourceId: string) {
        return await this.queryBus.execute(new ResourceAgentsQuery(resourceId));
    }

    @MessagePattern(patterns.getResourceTypeAgents)
    async getResourceTypeAgents(resourceTypeId: string) {
        return await this.queryBus.execute(
            new ResourceTypeAgentsQuery(resourceTypeId)
        );
    }

    @MessagePattern(patterns.getTeamOptions)
    async getTeamOptions(workpackageId: string) {
        const result = await this.queryBus.execute(new TeamOptionsQuery(workpackageId));
        console.log(result);
        return result
    }

    @MessagePattern(patterns.getDeleteAgentConsequences)
    async getDeleteAgentConsequences(agentId: string) {
        return await this.queryBus.execute(
            new DeleteAgentConsequencesQuery(agentId)
        );
    }

    @EventPattern(ResourceCreatedEvent.name)
    async handleResourceCreated(@Payload() event: ResourceCreatedEvent) {
        for (let i = 0; i < event.body.resourceTypes.length; i++){
            await this.commandBus.execute(
                new CreateAgentCommand(
                    { resourcetypeId: event.body.resourceTypes[i], resourceId: event.body.id },
                    event.uid
                )
            )
        }
    }

    @EventPattern(ResourceRemovedEvent.name)
    async handleResourceRemoved(){
        await this.commandBus.execute(new DeleteOrphanAgentsCommand())
    }
}
