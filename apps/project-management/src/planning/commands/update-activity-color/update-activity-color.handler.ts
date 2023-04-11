import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

import { Neo4jClient } from "@ns/neo4j";
import { DomainEvents } from "@ns/cqrs";
import { UpdateActivityColorCommand } from "./update-activity-color.command";
import {
    FormErrorResponse,
    FormResponse,
    FormSuccessResponse,
} from "@ns/definitions";
import { ActivityUpdatedEvent } from "@ns/events";

@CommandHandler(UpdateActivityColorCommand)
export class UpdateActivityColorHandler
    implements ICommandHandler<UpdateActivityColorCommand, FormResponse>
{
    constructor(
        private readonly client: Neo4jClient,
        private readonly publisher: DomainEvents
    ) {}

    async execute(command: UpdateActivityColorCommand): Promise<FormResponse> {
        const queryResult = await this.client.write(this.query, {
            activityId: command.dto.activityId,
            color: command.dto.color,
        });
        if (queryResult.summary.updateStatistics.containsUpdates()) {
            this.publisher.publish(new ActivityUpdatedEvent())
            return new FormSuccessResponse({ message: "Farven er opdateret." });
        }
        return new FormErrorResponse({
            message: "Farven kunne ikke opdateres.",
        });
    }

    query = `
        MATCH (a:Activity)
            WHERE a.id = $activityId
        SET a.color = $color
        RETURN {} AS result
   `;
}
