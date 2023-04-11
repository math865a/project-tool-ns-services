import {
    FormErrorResponse,
    FormResponse,
    FormSuccessResponse
} from "@ns/definitions";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { DomainEvents } from "@ns/cqrs";
import { CapacityViewNameUpdatedEvent } from "@ns/events";
import { Neo4jClient } from "@ns/neo4j";
import { UpdateCapacityViewNameCommand } from "./update-capacity-view-name.command";

@CommandHandler(UpdateCapacityViewNameCommand)
export class UpdateCapacityViewNameHandler
    implements ICommandHandler<UpdateCapacityViewNameCommand, FormResponse>
{
    constructor(
        private readonly client: Neo4jClient,
        private readonly publisher: DomainEvents
    ) {}

    async execute(
        command: UpdateCapacityViewNameCommand
    ): Promise<FormResponse> {
        const queryResult = await this.client.write(this.query, {
            ...command.dto,
            uid: command.uid,
        });
        if (queryResult.summary.updateStatistics.containsUpdates()) {
            this.publisher.publish(new CapacityViewNameUpdatedEvent());
            return new FormSuccessResponse({
                message: "Navnet blev opdateret.",
            });
        }
        return new FormErrorResponse({
            message: "Der skete en fejl under opdateringen af navnet.",
        });
    }

    query = `
        MATCH (view:CapacityBoardView)
            WHERE view.id = $viewId
        SET view.name = $name

   `;
}
