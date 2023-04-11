import {
    FormErrorResponse,
    FormResponse,
    FormSuccessResponse,
} from "@ns/definitions";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { DomainEvents } from "@ns/cqrs";
import { Neo4jClient } from "@ns/neo4j";
import { AssignmentDeletedEvent } from "@ns/events";
import { DeleteAssignmentCommand } from "./delete-assignment.command";

@CommandHandler(DeleteAssignmentCommand)
export class DeleteAssignmentHandler
    implements ICommandHandler<DeleteAssignmentCommand, FormResponse>
{
    constructor(private client: Neo4jClient, private publisher: DomainEvents) {}

    async execute({dto}: DeleteAssignmentCommand): Promise<FormResponse> {
        const queryResult = await this.client.write(this.query, {
            agentId: dto.agentId,
            taskId: dto.taskId,
        });
        const workpackageId = queryResult.records[0]?.get("workpackageId");
        const agentId = queryResult.records[0]?.get("agentId");
        if (agentId && workpackageId) {
            this.publisher.publish(new AssignmentDeletedEvent());
            return new FormSuccessResponse({
                message: "Teammedlemmet blev fjernet fra opgaven.",
            });
        }
        return new FormErrorResponse({
            message: "Teammedlemmet kunne ikke fjernes fra opgaven.",
        });
    }

    query = `
        MATCH (agent:Agent)-[rel:IS_ASSIGNED_TO]->(t:Task)<-[:HAS*3]-(w:Workpackage)
            WHERE agent.id = $agentId
            AND t.id = $taskId
        
        CALL {
            WITH t, agent
            MATCH (allocation)<-[:IS_ASSIGNED_TO]-(agent)
                WHERE (allocation)<-[:HAS]-(t)
            DETACH DELETE allocation
        }
        DELETE rel
        RETURN agent.id AS agentId, w.id AS workpackageId
    `;
}
