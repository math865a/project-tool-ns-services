import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { Neo4jClient } from "@ns/neo4j";
import { DomainEvents } from "@ns/cqrs";

export class RemoveFavoriteCommand {
    constructor(
        public readonly recordId: string,
        public readonly uid: string
    ) {}
}

@CommandHandler(RemoveFavoriteCommand)
export class RemoveFavoriteHandler
    implements ICommandHandler<RemoveFavoriteCommand, any>
{
    constructor(
        private readonly client: Neo4jClient,
        private readonly publisher: DomainEvents
    ) {}

    async execute(command: RemoveFavoriteCommand): Promise<any> {
        const queryResult = await this.client.write(this.query, {
            recordId: command.recordId,
            uid: command.uid,
        });
        const result = queryResult.records[0].get("result");

        return result;
    }

    query = `
        MATCH (u:User)-[rel:IS_FAVORITE]->(record)
            WHERE record.id = $recordId
            AND u.uid = $uid
        DELETE rel
        RETURN {} AS result
   `;
}
