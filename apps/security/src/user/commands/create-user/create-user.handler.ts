import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateUserCommand } from "./create-user.command";
import {
    FormResponse,
    FormSuccessResponse,
    FormErrorResponse,
} from "@ns/definitions";
import { DomainEvents } from "@ns/cqrs";
import { Neo4jClient } from "@ns/neo4j";
import { UserCreatedEvent } from "@ns/events";
import { CreateUserDto } from "@ns/dto";

@CommandHandler(CreateUserCommand)
export class CreateUserHandler
    implements ICommandHandler<CreateUserCommand, FormResponse>
{
    constructor(private client: Neo4jClient, private publisher: DomainEvents) {}

    async execute(command: CreateUserCommand): Promise<FormResponse> {
        const labels = this.getLabels(command.dto);
        const queryResult = await this.client.write(this.query, {
            ...command.dto,
            labels: labels
        });
        if (queryResult.summary.updateStatistics.containsUpdates()) {
            this.publisher.publish(
                new UserCreatedEvent(command.dto, command.uid)
            );
            return new FormSuccessResponse({
                message: "Brugeren blev oprettet",
            });
        }
        return new FormErrorResponse({
            message: "Brugeren kunne ikke oprettes",
        });
    }

    getLabels(dto: CreateUserDto){
        const labels = ["User"];
        if (dto.isProjectManager){
            labels.push("ProjectManager");
        }
        if (dto.isResource){
            labels.push("Resource");
        }
        return labels;
    }

    query = `
        MERGE (user {
            id: $uid
        })
        set user += {
            uid: $uid,
            name: $name,
            email: $email,
            color: $color,
            isDeactivated: false,
            lastSeen: null,
            isOnline: false
        }
        WITH user
        CALL apoc.create.addLabels(user, $labels)
        YIELD node AS u

        UNWIND $accessGroups AS accessGroup
            MATCH (ag:AccessGroup)
                WHERE ag.id = accessGroup
            MERGE (u)-[:IN_ACCESS_GROUP {timestamp: timestamp()}]->(ag)
    `;
}
