import {
    FormResponse,
    FormSuccessResponse,
} from "@ns/definitions";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { DomainEvents } from "@ns/cqrs";
import { DefaultCapacityViewUpdatedEvent } from "@ns/events";
import { Neo4jClient } from "@ns/neo4j";
import { UpdateDefaultCapacityViewCommand } from "./update-default-capacity-view.command";

@CommandHandler(UpdateDefaultCapacityViewCommand)
export class UpdateDefaultCapacityViewHandler
    implements ICommandHandler<UpdateDefaultCapacityViewCommand, FormResponse>
{
    constructor(
        private readonly client: Neo4jClient,
        private readonly publisher: DomainEvents
    ) {}

    async execute(
        command: UpdateDefaultCapacityViewCommand
    ): Promise<FormResponse> {
        const queryResult = await this.client.write(
            command.dto.isDefault ? this.makeNotDefaultQuery : this.query,
            {
                viewId: command.dto.viewId,
                uid: command.uid,
            }
        );
        if (queryResult.summary.updateStatistics.containsUpdates()) {
            this.publisher.publish(new DefaultCapacityViewUpdatedEvent());
            if (command.dto.isDefault) {
                return new FormSuccessResponse({
                    message: "Visningen blev fjernet som standardvisning.",
                });
            }
            {
                return new FormSuccessResponse({
                    message: "Visningen blev sat som standardvisning.",
                });
            }
        }
        return new FormSuccessResponse({
            message:
                "Der skete en fejl under opdateringen af standardvisningen.",
        });
    }

    makeNotDefaultQuery = `
        MATCH (u:User)-[rel:DEFAULT_CAPACITY_VIEW]->(b:CapacityBoardView)
            WHERE u.uid = $uid AND b.id = $viewId
        DELETE rel
   `;

    query = `
    
        MATCH (u:User)
            WHERE u.uid = $uid
        CALL {
            WITH u
            MATCH (u)-[rel:DEFAULT_CAPACITY_VIEW]->(:CapacityBoardView)
            DELETE rel
        }
        CALL {
            WITH u
            MATCH (newView:CapacityBoardView)
                WHERE newView.id = $viewId
            MERGE (u)-[:DEFAULT_CAPACITY_VIEW]->(newView)
        }
        RETURN {} AS result
    `;
}
