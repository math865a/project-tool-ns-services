import {
    FormErrorResponse,
    FormResponse,
    FormSuccessResponse,
} from "@ns/definitions";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { DomainEvents } from "@ns/cqrs";
import { Neo4jClient } from "@ns/neo4j";
import { AgentDeletedEvent } from "@ns/events";
import { DeleteAgentCommand } from "./delete-agent.command";

@CommandHandler(DeleteAgentCommand)
export class DeleteAgentHandler
    implements ICommandHandler<DeleteAgentCommand, FormResponse>
{
    constructor(private client: Neo4jClient, private publisher: DomainEvents) {}

    async execute(command: DeleteAgentCommand): Promise<FormResponse> {
        const result = await this.client.write(this.query, command);
        if (result.summary.updateStatistics.systemUpdates() === 0) {
            return new FormErrorResponse({ message: "Der skete en fejl" });
        }
        this.publisher.publish(new AgentDeletedEvent());
        return new FormSuccessResponse({ message: "Agent slettet" });
    }

    query = `
        MATCH (agent:Agent)
            WHERE agent.id = $agentId
        CALL {
            WITH agent
            MATCH (agent)-[:IS_ASSIGNED_TO]->(a:Allocation)
            DETACH DELETE a
        }
        DETACH DELETE agent
    `;
}
