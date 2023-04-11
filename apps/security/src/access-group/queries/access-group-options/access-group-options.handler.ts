import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { Neo4jClient } from "@ns/neo4j";
import { AccessGroupOptionsQuery } from "./access-group-options.query";

@QueryHandler(AccessGroupOptionsQuery)
export class AccessGroupOptionsQueryHandler
    implements IQueryHandler<AccessGroupOptionsQuery>
{
    constructor(private client: Neo4jClient) {}

    async execute() {
        const queryResult = await this.client.read(this.query);
        return queryResult.records.map((d) => d.get("option"));
    }

    query = `
        MATCH (a:AccessGroup)
        RETURN {
            id: a.id,
            name: a.name,
            color: a.color,
            isAdmin: a.isAdmin
        } AS option
            ORDER BY option.name
    `;
}
