import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { DomainEvents } from "@ns/cqrs";
import {
    FormErrorResponse,
    FormResponse,
    FormSuccessResponse
} from "@ns/definitions";
import { CapacityViewUpdatedEvent } from "@ns/events";
import { Neo4jClient } from "@ns/neo4j";
import { UpdateCapacityViewCommand } from "./update-capacity-view.command";

@CommandHandler(UpdateCapacityViewCommand)
export class UpdateCapacityViewHandler
    implements ICommandHandler<UpdateCapacityViewCommand, FormResponse>
{
    constructor(
        private readonly client: Neo4jClient,
        private readonly publisher: DomainEvents
    ) {}

    async execute(command: UpdateCapacityViewCommand): Promise<FormResponse> {
        const queryResult = await this.client.write(this.query, {
            ...command.dto,
            uid: command.uid,
        });
        if (!queryResult.summary.updateStatistics.containsUpdates()) {
            this.publisher.publish(new CapacityViewUpdatedEvent());
            return new FormSuccessResponse({
                message: "Visningen blev opdateret.",
            });
        }
        return new FormErrorResponse({
            message: "Der skete en fejl under opdateringen af visningen.",
        });
    }

    query = `
        MATCH (view:CapacityBoardView)
            WHERE view.id = $viewId
        SET view += {
            order: $order,
            showResourcesWithNoBookings: $showResourcesWithNoBookings
        }
        WITH view
        CALL {
            WITH view
            MATCH (view)<-[rel:IN]-(r:Resource)
                WHERE r.id IN $resourcesToDelete
            DELETE rel
        }
        CALL {
            WITH view
            MATCH (resources:Resource)
                WHERE resources.id IN $resources
            UNWIND resources AS resource
                MERGE (resource)-[:IN]->(view) 
        }
        CALL {
            WITH view
            MATCH (view)<-[rels:IN]-(b:BookingStage)
                WHERE b.id IN $bookingStagesToDelete
            DELETE rels
        }
        CALL {
            WITH view
                MATCH (bookingStages:BookingStage)
                    WHERE bookingStages.name IN $bookingStages
                UNWIND bookingStages AS bookingStage
                    MERGE (bookingStage)-[:IN]->(view)
        }
        RETURN {} AS result
   `;
}
