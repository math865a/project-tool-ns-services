import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UpdateProjectManagerCommand } from "./update-project-manager.command";
import { Neo4jClient } from "@ns/neo4j";
import { DomainEvents } from "@ns/cqrs";
import {
    FormErrorResponse,
    FormResponse,
    FormSuccessResponse,
} from "@ns/definitions";
import { ProjectManagerUpdatedEvent } from "@ns/events";

@CommandHandler(UpdateProjectManagerCommand)
export class UpdateProjectManagerHandler
    implements ICommandHandler<UpdateProjectManagerCommand, FormResponse>
{
    constructor(private client: Neo4jClient, private publisher: DomainEvents) {}

    async execute(command: UpdateProjectManagerCommand): Promise<FormResponse> {
        const queryResult = await this.client.write(this.query, {
            ...command.dto,
        });
        if (queryResult.summary.updateStatistics.containsUpdates()) {
            this.publisher.publish(
                new ProjectManagerUpdatedEvent(command.dto, command.uid)
            );
            return new FormSuccessResponse({
                message: "Projektlederen blev opdateret",
            });
        }
        return new FormErrorResponse({
            message: "Der skete en fejl under opdateringen af projektlederen",
        });
    }

    query = `
        MATCH (n:ProjectManager)
            WHERE n.id = $id
        SET n += {
            name: $name,
            color: $color
        }
    `;
}
