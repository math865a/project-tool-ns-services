import { WorkpackageDeletedEvent } from "@ns/events";
import { Neo4jClient } from "@ns/neo4j";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { DeleteWorkpackageCommand } from "./delete-workpackage.command";
import { DomainEvents } from "@ns/cqrs";
import {
    FormErrorResponse,
    FormResponse,
    FormSuccessResponse,
} from "@ns/definitions";

@CommandHandler(DeleteWorkpackageCommand)
export class DeleteWorkpackageHandler
    implements ICommandHandler<DeleteWorkpackageCommand, FormResponse>
{
    constructor(
        private readonly client: Neo4jClient,
        private readonly publisher: DomainEvents
    ) {}

    async execute(command: DeleteWorkpackageCommand): Promise<FormResponse> {
        const queryResult = await this.client.write(this.query, {
            workpackageId: command.workpackageId,
            uid: command.uid,
        });
        if (queryResult.summary.counters.containsUpdates()) {
            this.publisher.publish(new WorkpackageDeletedEvent());
            return new FormSuccessResponse({
                message: "Arbejdspakken blev slettet.",
            });
        }
        return new FormErrorResponse({
            message: "Der skete en fejl under sletningen af arbejdspakken.",
        });
    }

    query = `
       MATCH (w:Workpackage)
            WHERE w.id = $workpackageId
        CALL {
            WITH w
            OPTIONAL MATCH (w)-[*1..4]->(a:Activity)
            DETACH DELETE a
        }
        CALL {
            WITH w
            MATCH (w)--(p:Proposition)
            OPTIONAL MATCH (p)--(prop:Proposal)
            OPTIONAL MATCH (p)-[*1..4]-(f:Snapshot)
            DETACH DELETE f
            DETACH DELETE prop
            DETACH DELETE p
        }
        DETACH DELETE w
   `;
}
