import {
    FormErrorResponse,
    FormResponse,
    FormSuccessResponse,
} from "@ns/definitions";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { DomainEvents } from "@ns/cqrs";
import { AccessGroupCreatedEvent } from "@ns/events";
import { Neo4jClient } from "@ns/neo4j";

import { CreateAccessGroupCommand } from "./create-access-group.command";

@CommandHandler(CreateAccessGroupCommand)
export class CreateAccessGroupHandler
    implements ICommandHandler<CreateAccessGroupCommand, FormResponse>
{
    constructor(private client: Neo4jClient, private publisher: DomainEvents) {}

    async execute(command: CreateAccessGroupCommand): Promise<FormResponse> {
        console.log(command, command.dto.permissions)
        const queryResult = await this.client.write(this.query, {
            uid: command.uid,
            ...command.dto,
        });
        console.log(queryResult.records)
        if (queryResult.summary.updateStatistics.containsUpdates()) {
            this.publisher.publish(
                new AccessGroupCreatedEvent(command.dto, command.uid)
            );
            return new FormSuccessResponse({
                message: "Adgangsgruppe oprettet",
            });
        }
        return new FormErrorResponse({
            message: "Adgangsgruppe kunne ikke oprettes",
        });
    }

    query = `
    MATCH (u:User {uid: $uid})
        CREATE (a:AccessGroup
            {
                id: $id,
                name: $name,
                description: $description,
                color: $color,
                isAdmin: false
            }    
        )
        MERGE (a)-[:CREATED_BY {timestamp: timestamp()}]->(u)     
        WITH a, u
        CALL {
            WITH a
            UNWIND $users as user
                MATCH (u:User {uid: user})
                MERGE (u)-[:IN_ACCESS_GROUP {timestamp: timestamp()}]->(a)
        }

        CALL {
            WITH a
            UNWIND $permissions as permission
                MATCH (page:Page)
                    WHERE page.name = permission[0]
                    MERGE (a)-[rel:HAS_PERMISSIONS]->(page)
                    SET rel = permission[1]
        }  

    `;
}

