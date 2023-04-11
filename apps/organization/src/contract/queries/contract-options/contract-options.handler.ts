import { Neo4jClient } from '@ns/neo4j';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ContractOptionsQuery } from './contract-options.query';

@QueryHandler(ContractOptionsQuery)
export class ContractOptionsHandler
    implements IQueryHandler<ContractOptionsQuery, any[]>
{
    constructor(private client: Neo4jClient) {}

    async execute(): Promise<any[]> {
        const result = await this.client.read(this.query);
        return result.records.map((record) => ({
            id: record.get('id'),
            name: record.get('name'),
        }));
    }

    query = `
        MATCH (c:Contract)
        RETURN c.id AS id, c.name AS name
    `;
}
