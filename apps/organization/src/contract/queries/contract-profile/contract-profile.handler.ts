import { Neo4jClient } from '@ns/neo4j';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { ContractProfileQuery } from './contract-profile.query';

@QueryHandler(ContractProfileQuery)
export class ContractProfileQueryHandler
    implements IQueryHandler<ContractProfileQuery, any>
{
    constructor(private readonly client: Neo4jClient) {}

    async execute(query: ContractProfileQuery): Promise<any> {
        const queryResult = await this.client.read(this.query, {
            contractId: query.contractId,
        });
        return queryResult.records[0].get('result');
    }

    query = `
        MATCH (c:Contract)
            WHERE c.id = $contractId
        CALL {
            WITH c
            OPTIONAL MATCH (c)--(rt:ResourceType)
            WITH collect(rt{.*}) AS resourcetypesArr
            RETURN CASE
                WHEN resourcetypesArr[0].id IS NULL
                    THEN []
                ELSE resourcetypesArr
            END AS resourceTypes
        }
        RETURN {
            node: c{.*},
            resourceTypes: resourceTypes
        } AS result
   `;
}
