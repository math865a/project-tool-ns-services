import {

    FormResponse,
    FormSuccessResponse,
} from '@ns/definitions';
import { Neo4jClient } from "@ns/neo4j";
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

export class CreateCalendarCommand {
    constructor(
        public readonly dto: any,
        public readonly uid: string
    ) {}
}

@CommandHandler(CreateCalendarCommand)
export class CreateCalendarHandler
    implements ICommandHandler<CreateCalendarCommand>
{
    constructor(private client: Neo4jClient) {}

    async execute(command: CreateCalendarCommand): Promise<FormResponse> {
        const queryResult = await this.client.write(this.query, {
            name: command.dto.name,
            uid: command.uid,
        });
        const result = queryResult.records[0].get('result');
        return new FormSuccessResponse({ id: result.calendar.id });
    }

    query = `
        MATCH (u:User {uid: $uid})
        CREATE (c:Calendar {
            id: apoc.create.uuid(),
            name: $name
        })
        MERGE (c)-[ur:CREATED_BY {timestamp: timestamp()}]->(u)
        RETURN {
            calendar: c{.*},
            user: {
                node: u{.*},
                relation: ur{.*}
            }
        } AS result
    `;
}
