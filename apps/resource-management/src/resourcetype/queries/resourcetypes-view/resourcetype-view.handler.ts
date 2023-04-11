import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Neo4jClient } from "@ns/neo4j";
import { ResourceTypesViewQuery } from './resourcetypes-view.query';


@QueryHandler(ResourceTypesViewQuery)
export class ResourceTypesViewQueryHandler
    implements IQueryHandler<ResourceTypesViewQuery, any[]>
{
    constructor(private readonly client: Neo4jClient) {}

    async execute(): Promise<any[]> {
        const queryResult = await this.client.read(this.query);
        const response: any[] = queryResult.records.map((d) =>
            d.get('row')
        );
        return response;
    }

    query = `
        MATCH (resourceTypes:ResourceType)--(c:Contract)
        UNWIND resourceTypes AS rt
            CALL {
                WITH rt
                OPTIONAL MATCH (rt)--(:Agent)--(r:Resource)
                WITH count(r) AS resourceCount
                RETURN resourceCount
            }
        RETURN {
            node: rt{.*},
            contract: c{.*},
            resourceCount: resourceCount
        } AS row
        ORDER BY row.node.typeNo
   `;
}
