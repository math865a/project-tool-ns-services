import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { DomainEvents } from "@ns/cqrs";
import {
    FormErrorResponse, FormResponse, FormSuccessResponse
} from "@ns/definitions";
import { CapacityViewDeletedEvent } from "@ns/events";
import { Neo4jClient } from "@ns/neo4j";
import { DeleteCapacityViewCommand } from "./delete-capacity-view.command";

@CommandHandler(DeleteCapacityViewCommand)
export class DeleteCapacityViewHandler
    implements
        ICommandHandler<DeleteCapacityViewCommand, FormResponse>
{
    constructor(
        private readonly client: Neo4jClient,
        private readonly publisher: DomainEvents
    ) {}

    async execute(
        command: DeleteCapacityViewCommand
    ): Promise<FormResponse> {
        const queryResult = await this.client.write(this.query, command);
        if (queryResult.summary.updateStatistics.containsUpdates()){
            this.publisher.publish(new CapacityViewDeletedEvent());
            return new FormSuccessResponse({message: "Visningen blev slettet."})
        }
        return new FormErrorResponse({message: "Der skete en fejl under sletningen af visningen."})
    }

    query = `
        MATCH (view:CapacityBoardView)
            WHERE view.id = $viewId
        DETACH DELETE view
        RETURN {} AS result
   `;
}
