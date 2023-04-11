import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { Neo4jClient } from "@ns/neo4j";
import { DeleteResourceCommand } from "./delete-resource.command";
import { DomainEvents } from "@ns/cqrs";
import { ResourceDeletedEvent, ResourceRemovedEvent } from "@ns/events";
import {
    FormErrorResponse,
    FormResponse,
    FormSuccessResponse,
} from "@ns/definitions";

@CommandHandler(DeleteResourceCommand)
export class DeleteResourceHandler
    implements ICommandHandler<DeleteResourceCommand, FormResponse>
{
    constructor(
        private readonly client: Neo4jClient,
        private publisher: DomainEvents
    ) {}

    async execute(command: DeleteResourceCommand): Promise<FormResponse> {
        const { id, uid } = command;
        const shouldDelete = await this.examineLabels(id);
        if (shouldDelete) {
            const deleted = await this.deleteResource(id);
            if (deleted) {
                this.publisher.publish(new ResourceDeletedEvent({id}, uid));
                return new FormSuccessResponse({
                    message: "Ressourcen er blevet slettet",
                });
            }
        } else {
            const removed = await this.removeResource(id);
            if (removed) {
                this.publisher.publish(new ResourceRemovedEvent({id}, uid));
                return new FormSuccessResponse({
                    message: "Ressourcen er blevet fjernet",
                });
            }
        }
        return new FormErrorResponse({
            message: "Der skete en fejl under sletning af ressourcen",
        });
    }

    async examineLabels(id: string) {
        const queryResult = await this.client.read(this.labelsQuery, { id });
        const labels = queryResult.records[0].get("rLabels");
        return labels.length === 1;
    }

    labelsQuery = `
        MATCH (r:Resource)
            WHERE r.id = $id
        WITH labels(r) AS rLabels
        RETURN rLabels as rLabels
    `;

    async deleteResource(id: string) {
        const queryResult = await this.client.write(this.deleteQuery, { id });
        const { summary } = queryResult;
        return summary.updateStatistics.containsUpdates();
    }

    deleteQuery = `
        MATCH (r:Resource)
            WHERE r.id = $id
        DETACH DELETE r
    `;

    async removeResource(id: string) {
        const queryResult = await this.client.write(this.removeQuery, {
            id,
        });
        const { summary } = queryResult;
        return summary.updateStatistics.containsUpdates();
    }

    removeQuery = `
        MATCH (r:Resource)
            WHERE r.id = $id
        CALL {
            WITH r
            OPTIONAL MATCH (r)<-[:IS]->(a:Agent)
            DETACH DELETE a
        }
        REMOVE r:Resource
        REMOVE r.initials
        REMOVE r.costDefault
        REMOVE r.costOvertime
    `;
}
