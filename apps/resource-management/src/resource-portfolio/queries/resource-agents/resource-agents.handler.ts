import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ResourceAgentsQuery } from './resource-agents.query';
import { Neo4jClient } from '@ns/neo4j';

@QueryHandler(ResourceAgentsQuery)
export class ResourceAgentsQueryHandler implements IQueryHandler<ResourceAgentsQuery, any>{
    constructor(private readonly client: Neo4jClient){}

    async execute(query: ResourceAgentsQuery): Promise<any>{
        const queryResult = await this.client.read(this.query, query);
        return queryResult.records.map(d => d.get("resourcetype"))
    }

    query = `
        MATCH (r:Resource)<-[:IS]-(a:Agent)-[:IS]->(rt:ResourceType)--(c:Contract)
            WHERE r.id = $resourceId
        WITH rt{
            .*,
            agentId: a.id,
            contract: c{.*}
        } AS resourcetype 
            ORDER BY resourcetype.contract.name, resourcetype.typeNo
        RETURN resourcetype
    `;
};