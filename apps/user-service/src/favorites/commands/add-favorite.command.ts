import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Neo4jClient } from "@ns/neo4j";
import { DomainEvents } from "@ns/cqrs";

export class AddFavoriteCommand {
    constructor(
        public readonly recordId: string,
        public readonly uid: string
    ) {}
}


@CommandHandler(AddFavoriteCommand)
export class AddFavoriteHandler
    implements ICommandHandler<AddFavoriteCommand, void>
{
    constructor(
        private readonly client: Neo4jClient,
        private readonly publisher: DomainEvents
    ) {}

    async execute(command: AddFavoriteCommand): Promise<void> {
        await this.client.write(this.query, {
            recordId: command.recordId,
            uid: command.uid,
        });


    }

    query = `
        MATCH (u:User)
            WHERE u.uid = $uid
        MATCH (record)
            WHERE record.id = $recordId
        MERGE (u)-[:IS_FAVORITE]->(record)
        RETURN {} AS result
   `;
}
