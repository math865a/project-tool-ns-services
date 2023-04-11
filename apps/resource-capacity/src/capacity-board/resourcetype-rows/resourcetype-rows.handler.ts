import { Neo4jClient } from "@ns/neo4j";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { ResourceTypeRowsQuery } from "./resourcetype-rows.query";

@QueryHandler(ResourceTypeRowsQuery)
export class ResourceTypeRowsQueryHandler
    implements IQueryHandler<ResourceTypeRowsQuery, any[]>
{
    constructor(private readonly client: Neo4jClient) {}

    async execute(): Promise<any[]> {
        const queryResult = await this.client.read(this.query);
        const response: any[] = queryResult.records.map((d) => d.get("row"));
        return response;
    }

    query = `
        MATCH (resourceTypes:ResourceType)
        UNWIND resourceTypes AS rt
        CALL {
            WITH rt
            OPTIONAL MATCH (rt)<-[:IS]-(:Worker)-[:IS]->(r:Resource)
            WITH collect(r.id) AS arr
            RETURN CASE 
                WHEN arr[0] IS NULL
                    THEN []
                ELSE arr
            END AS resources
        }
        RETURN {
            id: rt.id,
            name: rt.name,
            typeNo: rt.typeNo,
            resources: resources
        } AS row
   `;
}
