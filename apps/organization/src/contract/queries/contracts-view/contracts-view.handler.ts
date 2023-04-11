import { Neo4jClient } from '@ns/neo4j';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { ContractViewQuery } from './contract-view.query';

@QueryHandler(ContractViewQuery)
export class ContractViewQueryHandler
    implements IQueryHandler<ContractViewQuery, any[]>
{
    constructor(private readonly client: Neo4jClient) {}

    async execute(): Promise<any[]> {
        const queryResult = await this.client.read(this.query);
        return queryResult.records.map((d) => d.get('row'));
    }

    query = `
        MATCH (c:Contract)
        RETURN {node: c{.*}} as row
   `;
}
