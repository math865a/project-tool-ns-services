import { Neo4jClient } from '@ns/neo4j';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { FinancialSourceViewQuery } from './financialsource-view.query';

@QueryHandler(FinancialSourceViewQuery)
export class FinancialSourceViewQueryHandler
    implements IQueryHandler<FinancialSourceViewQuery, any[]>
{
    constructor(private readonly client: Neo4jClient) {}

    async execute(): Promise<any[]> {
        const queryResult = await this.client.read(this.query);
        return queryResult.records.map((d) => d.get('row'));
    }

    query = `
        MATCH (f:FinancialSource)
        RETURN {node: f{.*}} as row
   `;
}
