import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { Neo4jClient } from "@ns/neo4j";
import { DefaultCalendarQuery } from "./default-calendar.query";

@QueryHandler(DefaultCalendarQuery)
export class DefaultCalendarQueryHandler
    implements IQueryHandler<DefaultCalendarQuery>
{
    constructor(private client: Neo4jClient) {}

    async execute(query: DefaultCalendarQuery): Promise<any> {
        const queryResult = await this.client.read(this.query);
        return queryResult.records[0].get("calendar");
    }

    query = `
        MATCH (c:Calendar)
            WHERE c.isDefault
        RETURN c{.*} AS calendar
    `;
}
