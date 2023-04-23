import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { Neo4jClient } from "@ns/neo4j";
import { DomainEvents } from "@ns/cqrs";
import {
    FormErrorResponse,
    FormResponse,
    FormSuccessResponse,
} from "@ns/definitions";
import { ActivityUpdatedEvent } from "@ns/events";
import { UpdateActivityCommand } from "./update-activity.command";

@CommandHandler(UpdateActivityCommand)
export class UpdateActivityHandler
    implements ICommandHandler<UpdateActivityCommand, FormResponse>
{
    constructor(
        private readonly client: Neo4jClient,
        private readonly publisher: DomainEvents
    ) {}

    async execute(command: UpdateActivityCommand): Promise<FormResponse> {
        const queryResult = await this.client.write(this.query, command.dto);
        if (queryResult.summary.updateStatistics.containsUpdates()) {
            this.publisher.publish(
                new ActivityUpdatedEvent(command.dto, command.uid)
            );
            return new FormSuccessResponse({
                message: "Aktiviteten blev opdateret",
            });
        }
        return new FormErrorResponse({
            message: "Aktiviteten kunne ikke opdateres.",
        });
    }

    query = `
        MATCH (a:Activity)
            WHERE a.id = $activityId
        SET a.name = $name
        SET a.color = $color
        SET a.description = $description
        SET a.updatedAt = timestamp()
   `;
}
