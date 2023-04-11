import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { RemoveProjectManagerCommand } from "./remove-project-manager.command";
import {
    FormErrorResponse,
    FormResponse,
    FormSuccessResponse,
} from "@ns/definitions";
import { Neo4jClient } from "@ns/neo4j";
import { DomainEvents } from "@ns/cqrs";
import { ProjectManagerDeletedEvent, ProjectManagerRemovedEvent } from "@ns/events";

@CommandHandler(RemoveProjectManagerCommand)
export class RemoveProjectManagerHandler
    implements ICommandHandler<RemoveProjectManagerCommand, FormResponse>
{
    constructor(private client: Neo4jClient, private publisher: DomainEvents) {}

    async execute(command: RemoveProjectManagerCommand): Promise<FormResponse> {
        const { id, uid } = command;
        const shouldDelete = await this.examineLabels(id);
        if (shouldDelete) {
            const deleted = await this.deleteProjectManager(id);
            if (deleted) {
                this.publisher.publish(new ProjectManagerDeletedEvent(id, uid));
                return new FormSuccessResponse({
                    message: "Projektlederen er blevet slettet",
                });
            }
        } else {
            const removed = await this.removeProjectManagerLabel(id);
            if (removed) {
                this.publisher.publish(new ProjectManagerRemovedEvent(id, uid));
                return new FormSuccessResponse({
                    message: "Projektlederen er blevet fjernet",
                });
            }
        }
        return new FormErrorResponse({
            message: "Der skete en fejl under sletning af projektlederen",
        });
    }

    async examineLabels(id: string) {
        const queryResult = await this.client.read(this.labelsQuery, { id });
        const labels = queryResult.records[0].get("pmLabels")
        console.log(labels)
        return labels.length === 1;
    }

    labelsQuery = `
        MATCH (pm:ProjectManager)
            WHERE pm.id = $id
        WITH labels(pm) AS pmLabels
        RETURN pmLabels as pmLabels
    `;

    async deleteProjectManager(id: string) {
        const queryResult = await this.client.write(this.deleteQuery, { id });
        const { summary } = queryResult;
        return summary.updateStatistics.containsUpdates();
    }

    deleteQuery = `
        MATCH (pm:ProjectManager)
            WHERE pm.id = $id
        DETACH DELETE pm
    `;

    async removeProjectManagerLabel(id: string) {
        const queryResult = await this.client.write(this.removeLabelQuery, {
            id,
        });
        const { summary } = queryResult;
        return summary.updateStatistics.containsUpdates();
    }

    removeLabelQuery = `
        MATCH (pm:ProjectManager)
            WHERE pm.id = $id
        CALL {
            WITH pm
            OPTIONAL MATCH (pm)-[rel:MANAGES]->(p:Plan)
            DELETE rel
        }
        REMOVE pm:ProjectManager
    `;
}
