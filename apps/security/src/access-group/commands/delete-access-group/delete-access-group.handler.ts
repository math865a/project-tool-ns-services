import {
    FormErrorResponse,
    FormResponse,
    FormSuccessResponse,
} from "@ns/definitions";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { DomainEvents } from "@ns/cqrs";
import { AccessGroupDeletedEvent } from "@ns/events";
import { Neo4jClient } from "@ns/neo4j";
import { DeleteAccessGroupCommand } from "./delete-access-group.command";

@CommandHandler(DeleteAccessGroupCommand)
export class DeleteAccessGroupHandler
    implements ICommandHandler<DeleteAccessGroupCommand, FormResponse>
{
    constructor(
        private readonly client: Neo4jClient,
        private publisher: DomainEvents
    ) {}

    async execute({ accessGroupId, uid }: DeleteAccessGroupCommand) {
        const queryResult = await this.client.write(this.query, {
            accessGroupId,
        });
        const affectedUsers = queryResult.records[0].get("affectedUsers");
        if (queryResult.summary.counters.containsUpdates()) {
            this.publisher.publish(
                new AccessGroupDeletedEvent(affectedUsers, uid)
            );
            return new FormSuccessResponse({
                message: "Adgangsgruppen blev slettet",
            });
        }
        return new FormErrorResponse({
            message: "Der skete en fejl under sletningen af adgangsgruppen",
        });
    }

    query = `
        MATCH (a:AccessGroup {id: $accessGroupId})

        CALL {
            WITH a
            OPTIONAL MATCH (u:User)-[:IN_ACCESS_GROUP]->(a)
            WITH collect(u.uid) AS users
            RETURN CASE
                WHEN users[0] IS NULL
                    THEN []
                ELSE users
            END AS affectedUsers
        }
        DETACH DELETE a
        RETURN affectedUsers
    `;
}
