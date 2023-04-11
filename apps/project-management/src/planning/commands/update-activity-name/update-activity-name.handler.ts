import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { Neo4jClient } from "@ns/neo4j";
import { DomainEvents } from "@ns/cqrs";
import { UpdateActivityNameCommand } from "./update-activity-name.command";
import {
    FormErrorResponse,
    FormResponse,
    FormSuccessResponse,
} from "@ns/definitions";
import { ActivityUpdatedEvent } from "@ns/events";

@CommandHandler(UpdateActivityNameCommand)
export class UpdateActivityNameHandler
    implements ICommandHandler<UpdateActivityNameCommand, FormResponse>
{
    constructor(
        private readonly client: Neo4jClient,
        private readonly publisher: DomainEvents
    ) {}

    async execute(command: UpdateActivityNameCommand): Promise<FormResponse> {
        const queryResult = await this.client.write(this.query, {
            activityId: command.dto.activityId,
            name: command.dto.name,
        });
        if (queryResult.summary.updateStatistics.containsUpdates()) {
            this.publisher.publish(new ActivityUpdatedEvent());
            return new FormSuccessResponse({ message: "Navnet er opdateret." });
        }
        return new FormErrorResponse({
            message: "Navnet kunne ikke opdateres.",
        });
    }

    query = `
        MATCH (a:Activity)
            WHERE a.id = $activityId
        SET a.name = $name
   `;
}
