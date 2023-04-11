import { IQuery, IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { Neo4jClient } from "@ns/neo4j";
import { CalendarOptionsQuery } from "./calendar-options.query";

@QueryHandler(CalendarOptionsQuery)
export class CalendarOptionsQueryHandler
    implements IQueryHandler<CalendarOptionsQuery>
{
    constructor(private client: Neo4jClient) {}

    async execute(query: CalendarOptionsQuery): Promise<any> {
        const queryResult = await this.client.read(this.query);
        return queryResult.records.map((d) => d.get("option"));
    }

    query = `
        MATCH (c:Calendar)
        WITH c ORDER BY c.name

        RETURN  {
            id: c.id,
            name: c.name
        } AS option
    `;
}
