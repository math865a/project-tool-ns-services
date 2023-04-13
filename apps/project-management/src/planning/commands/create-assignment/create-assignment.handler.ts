import {
    FormErrorResponse,
    FormResponse,
    FormSuccessResponse,
} from "@ns/definitions";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { DomainEvents } from "@ns/cqrs";
import { Neo4jClient } from "@ns/neo4j";
import { AssignmentCreatedEvent } from "@ns/events";
import { CreateAssignmentCommand } from "./create-assignment.command";

@CommandHandler(CreateAssignmentCommand)
export class CreateAssignmentHandler
    implements ICommandHandler<CreateAssignmentCommand, FormResponse>
{
    constructor(
        private readonly client: Neo4jClient,
        private readonly publisher: DomainEvents
    ) {}

    async execute(command: CreateAssignmentCommand): Promise<FormResponse> {
        const queryResult = await this.client.write(this.query, {
            ...command.dto,
            uid: command.uid,
        });
        if (queryResult.summary.updateStatistics.containsUpdates()) {
            this.publisher.publish(new AssignmentCreatedEvent(command.dto, command.uid));
            return new FormSuccessResponse({message: "Tildelingen blev oprettet."});
        }
        return new FormErrorResponse({ message: "Der skete en fejl." });
    }

    query = `
        MATCH (u:User {uid: $uid})
        MATCH (t:Task)
            WHERE t.id = $taskId
        MATCH (agent:Agent)
            WHERE agent.id = $agentId
        MERGE (agent)-[:IS_ASSIGNED_TO {createdBy: u.uid, createdAt: timestamp(), id: $id}]->(t)
   `;
}
