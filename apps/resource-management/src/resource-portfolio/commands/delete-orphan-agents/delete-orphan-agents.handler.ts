import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { DeleteOrphanAgentsCommand } from "./delete-orphan-agents.command";
import { Neo4jClient } from "@ns/neo4j";
import { DomainEvents } from "@ns/cqrs";
import { OrphanAgentsDeletedEvent } from "@ns/events";

@CommandHandler(DeleteOrphanAgentsCommand)
export class DeleteOrphanAgentsHandler
    implements ICommandHandler<DeleteOrphanAgentsCommand>
{
    constructor(private client: Neo4jClient, private publisher: DomainEvents) {}

    async execute(): Promise<void> {
        const queryResult = await this.client.write(this.query);
        if (queryResult.summary.updateStatistics.containsUpdates()){
            this.publisher.publish(new OrphanAgentsDeletedEvent())
        }
    }

    query = `
        MATCH (a:Agent)
            WHERE NOT (a)-[:IS]->(:Resource)

        DETACH DELETE a
    `;
}
