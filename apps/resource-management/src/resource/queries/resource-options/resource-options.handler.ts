import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { ResourceOptionsQuery } from "./resource-options.query";
import { Neo4jClient } from "@ns/neo4j";

@QueryHandler(ResourceOptionsQuery)
export class ResourceOptionsQueryHandler
    implements IQueryHandler<ResourceOptionsQuery>
{
    constructor(private client: Neo4jClient) {}

    async execute() {
        console.log("resource-options")
        const { records } = await this.client.read(`
            MATCH (r:Resource)
            WITH {
                id: r.id,
                name: r.name,
                color: r.color
            } AS resource ORDER BY resource.name
            RETURN resource
        `);
        return records.map((d) => d.get("resource"));
    }
}
