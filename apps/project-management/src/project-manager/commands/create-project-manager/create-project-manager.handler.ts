import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateProjectManagerCommand } from "./create-project-manager.command";
import {
    FormErrorResponse,
    FormResponse,
    FormSuccessResponse,
} from "@ns/definitions";
import { Neo4jClient } from "@ns/neo4j";
import { DomainEvents } from "@ns/cqrs";
import { ProjectManagerCreatedEvent } from "@ns/events";

@CommandHandler(CreateProjectManagerCommand)
export class CreateProjectManagerHandler
    implements ICommandHandler<CreateProjectManagerCommand, FormResponse>
{
    constructor(private client: Neo4jClient, private publisher: DomainEvents) {}

    async execute({
        dto,
        uid,
    }: CreateProjectManagerCommand): Promise<FormResponse> {
        const queryResult = await this.client.write(this.query, {
            ...dto,
        });
        if (queryResult.summary.updateStatistics.containsUpdates()) {
            this.publisher.publish(new ProjectManagerCreatedEvent(dto, uid));
            return new FormSuccessResponse({
                message: "Projektlederen er oprettet",
            });
        }
        return new FormErrorResponse({
            message: "Det skete en fejl ved oprettelsen af projektlederen",
        });
    }

    query = `
            MERGE (pm {
                id: $id
            })
            SET pm += {
                name: $name,
                color: $color
            }
            WITH pm
            SET pm:ProjectManager
        `;
}
