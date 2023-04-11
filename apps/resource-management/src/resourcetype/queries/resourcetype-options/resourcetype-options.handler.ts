import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { Neo4jClient } from "@ns/neo4j";
import { ResourceTypeOptionsQuery } from "./resourcetype-options.query";

@QueryHandler(ResourceTypeOptionsQuery)
export class ResourceTypeOptionsHandler
    implements IQueryHandler<ResourceTypeOptionsQuery>
{
    constructor(private client: Neo4jClient) {}

    async execute(query: ResourceTypeOptionsQuery): Promise<any> {
        const queryResult = await this.client.read(this.query, {});
        const result = queryResult.records.map((d) => d.get("resourcetype"));
        return result;
    }

    query = `
        MATCH (rt:ResourceType)--(c:Contract)
        RETURN {
            id: rt.id,
            name: rt.name,
            typeNo: rt.typeNo,
            contract: {
                id: c.id,
                name: c.name
            }
        } AS resourcetype
            ORDER BY resourcetype.typeNo
`;
}
