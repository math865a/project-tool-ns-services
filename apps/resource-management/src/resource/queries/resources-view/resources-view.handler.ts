import { QueryHandler, IQueryHandler } from "@nestjs/cqrs";
import { Neo4jClient } from "@ns/neo4j";
import { ResourcesViewQuery } from "./resources-view.query";

@QueryHandler(ResourcesViewQuery)
export class ResourcesViewQueryHandler
    implements IQueryHandler<ResourcesViewQuery>
{
    constructor(private readonly client: Neo4jClient) {}

    async execute(): Promise<any> {
        const queryResult = await this.client.read(this.query);
        const response = queryResult.records.map((d) => d.get("row"));
        return response;
    }

    query = `
        MATCH (rs:Resource)
        UNWIND rs AS r
        CALL {
            WITH r
            OPTIONAL MATCH (r)<-[:IS]-(:Agent)-[:IS]->(rts:ResourceType)
            RETURN DISTINCT rts AS rt
        }
        WITH collect({
            id: rt.id,
            name: rt.name,
            typeNo: apoc.text.join(["type", toString(rt.typeNo)], " ")
        }) AS resourceTypes, r
        CALL {
            WITH r
            WITH exists((:User)-[:IS]->(r)) AS isUser
            RETURN isUser
        }

        RETURN {
            node: r{.*},
            resourceTypes: resourceTypes,
            isUser: isUser
        } AS row
        ORDER BY row.node.name
   `;
}
