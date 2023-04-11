import { FormErrorResponse, FormResponse, FormSuccessResponse } from "@ns/definitions";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { DomainEvents } from "@ns/cqrs";
import { Neo4jClient } from "@ns/neo4j";
import { UpdateAccessGroupCommand } from "./update-access-group.command";

import { PipedUpsertAccessGroupDto } from "@ns/dto";
import { AccessGroupUpdatedEvent } from "@ns/events";
import { omit } from "lodash";

@CommandHandler(UpdateAccessGroupCommand)
export class UpdateAccessGroupHandler
    implements ICommandHandler<UpdateAccessGroupCommand, FormResponse>
{
    constructor(private client: Neo4jClient, private publisher: DomainEvents) {}

    async execute(command: UpdateAccessGroupCommand): Promise<FormResponse> {
        const properties = this.getProperties(command.dto);
        const queryResult = await this.client.write(this.query, {
            uid: command.uid,
            id: command.dto.id,
            properties,
            users: command.dto.users,
            permissions: command.dto.permissions,
        });

        if (queryResult.summary.updateStatistics.containsUpdates()) {
            this.publisher.publish(
                new AccessGroupUpdatedEvent(command.dto, command.uid)
            );
            return new FormSuccessResponse({
                message: "Adgangsgruppen blev opdateret",
            });
        }
        return new FormErrorResponse({
            message: "Adgangsgruppen kunne ikke opdateres",
        });

    }

    getProperties(dto: PipedUpsertAccessGroupDto) {
        return omit(dto, ["users", "permissions", "isAdmin", "id"]);
    }

    

    query = `
        MATCH (u:User {uid: $uid})
        MATCH (a:AccessGroup {id: $id})

        CALL {
            WITH a
            SET a += $properties
        }

        CALL {
            WITH a
            MATCH (u:User)-[rel:IN_ACCESS_GROUP]->(a)
                WHERE NOT u.uid IN $users
            DELETE rel
        }

        CALL {
            WITH a
            UNWIND $users as user
                MATCH (u:User)
                    WHERE u.uid = user
            MERGE (u)-[rel:IN_ACCESS_GROUP]->(a)
                ON CREATE
                    SET rel.timestamp = timestamp()
        }

        CALL {
            WITH a
            UNWIND $permissions as permission
                MATCH (a)-[r:HAS_PERMISSIONS]->(page:Page)
                    WHERE page.name = permission[0]
                SET r += permission[1]
        }
    `;
}
