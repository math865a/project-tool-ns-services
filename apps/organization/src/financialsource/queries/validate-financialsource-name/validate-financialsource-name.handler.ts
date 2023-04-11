import { Neo4jClient } from '@ns/neo4j';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ValidateFinancialSourceNameQuery } from './validate-financialsource-name.query';

@QueryHandler(ValidateFinancialSourceNameQuery)
export class ValidateFinancialSourceNameQueryHandler
    implements IQueryHandler<ValidateFinancialSourceNameQuery, boolean>
{
    constructor(private client: Neo4jClient) {}

    async execute({ name }: ValidateFinancialSourceNameQuery) {
        const queryResult = await this.client.read(this.query, {
            name: name,
        });
        const exists = queryResult.records[0]?.get('exists');
        return exists;
    }

    query = `
        OPTIONAL MATCH (f:FinancialSource)
            WHERE f.name = $name
        RETURN CASE
            WHEN f IS NOT NULL
                THEN true
            ELSE false
        END AS exists
    `;
}
