import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UpdateUserAccessGroupsCommand } from "./update-user-access-groups.command";
import { Neo4jClient } from "@ns/neo4j";
import { DomainEvents } from "@ns/cqrs";
import { UserAccessGroupsUpdatedEvent } from "@ns/events";
import {
    FormErrorResponse,
    FormResponse,
    FormSuccessResponse,
} from "@ns/definitions";

@CommandHandler(UpdateUserAccessGroupsCommand)
export class UpdateUserAccessGroupsHandler
    implements ICommandHandler<UpdateUserAccessGroupsCommand, FormResponse>
{
    constructor(private client: Neo4jClient, private publisher: DomainEvents) {}

    async execute(
        command: UpdateUserAccessGroupsCommand
    ): Promise<FormResponse> {
        const queryResult = await this.client.write(this.query, {
            uid: command.uid,
            accessGroups: command.accessGroups,
        });
        if (queryResult.summary.counters.containsUpdates()) {
            this.publisher.publish(
                new UserAccessGroupsUpdatedEvent(
                    command.uid,
                    command.accessGroups
                )
            );
            return new FormSuccessResponse({
                message: "Brugerens adgangsgrupper blev opdateret.",
            });
        }
        return new FormErrorResponse({
            message:
                "Der skete en fejl under opdateringen af brugerens adgangsgrupper.",
        });
    }

    query = `
        MATCH (u:User)
            WHERE u.uid = $uid

        CALL {
            WITH u
            MATCH (u)-[rel:IN_ACCESS_GROUP]->(ag:AccessGroup)
                WHERE NOT ag.id IN $accessGroups
            DELETE rel
        }

        UNWIND $accessGroups AS accessGroup
            MATCH (ag:AccessGroup)
                WHERE ag.id = accessGroup
            MERGE (u)-[:IN_ACCESS_GROUP]->(ag)
    `;
}
