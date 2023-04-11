import {
    FormErrorResponse,
    FormResponse,
    FormSuccessResponse,
} from "@ns/definitions";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { DomainEvents } from "@ns/cqrs";
import { CapacityViewCreatedEvent } from "@ns/events";
import { Neo4jClient } from "@ns/neo4j";
import { CreateCapacityViewCommand } from "./create-capacity-view.command";

@CommandHandler(CreateCapacityViewCommand)
export class CreateCapacityViewHandler
    implements ICommandHandler<CreateCapacityViewCommand, FormResponse>
{
    constructor(
        private readonly client: Neo4jClient,
        private readonly publisher: DomainEvents
    ) {}

    async execute({
        dto,
        uid,
    }: CreateCapacityViewCommand): Promise<FormResponse> {
        const queryResult = await this.client.write(this.query, {
            ...dto,
            uid: uid,
        });
        if (queryResult.summary.updateStatistics.containsUpdates()) {
            this.publisher.publish(new CapacityViewCreatedEvent());
            return new FormSuccessResponse({
                message: "Visningen blev oprettet.",
            });
        }

        return new FormErrorResponse({
            message: "Der skete en fejl under oprettelsen af visningen.",
        });
    }

    query = `
        MATCH (u:User {uid: $uid})
        CREATE (view:CapacityBoardView {
            id: $viewId,
            name: $name,
            order: $order,
            showResourcesWithNoBookings: $showResourcesWithNoBookings
        })
        MERGE (u)-[:HAS]->(view)
        WITH view
        CALL {
            WITH view
            MATCH (resources:Resource)
                WHERE resources.id IN $resources
            UNWIND resources AS resource
                MERGE (resource)-[:IN]->(view)
        }
        CALL {
            WITH view
            MATCH (bookingStages:BookingStage)
                WHERE bookingStages.name IN $bookingStages
            UNWIND bookingStages AS bookingStage
                MERGE (bookingStage)-[:IN]->(view)
        }
   `;
}
