import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ResourceTypeAgentsQuery } from "./resourcetype-agents.query"
import { Neo4jClient } from '@ns/neo4j';

@QueryHandler(ResourceTypeAgentsQuery)
export class ResourceTypeAgentsQueryHandler implements IQueryHandler<ResourceTypeAgentsQuery, any>{
    constructor(private readonly client: Neo4jClient){}

    async execute(query: ResourceTypeAgentsQuery): Promise<any>{
        const queryResult = await this.client.read(this.query, query);
        return queryResult.records.map(d => d.get("resourceAgent"))
    }

    query = `
        MATCH (rt:ResourceType)--(a:Agent)--(r:Resource)
            WHERE rt.id = $resourceTypeId
        WITH r{
            .*,
            agentId: a.id
        } AS resourceAgent
            ORDER BY resourceAgent.name
        RETURN resourceAgent
    `;
};