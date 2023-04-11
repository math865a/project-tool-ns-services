import { QueryHandler, IQueryHandler } from "@nestjs/cqrs";
import { Neo4jClient } from "@ns/neo4j";
import { ValidateContractQuery } from "./validate-contract.query";

@QueryHandler(ValidateContractQuery)
export class ValidateContractHandler implements IQueryHandler<ValidateContractQuery> {
    constructor(private readonly client: Neo4jClient) {}

    async execute(query: ValidateContractQuery): Promise<ValidateContractQuery> {
        const isUnique = await this.client.read(this.query, {
            name: query.name,
            abbrevation: query.abbrevation,
            id: query.id ?? "blabla",
        });
        return isUnique.records[0].get('isUnique');
    }


    query = `
        OPTIONAL MATCH (c:Contract)
            WHERE (c.name = $name OR c.abbrevation = $abbrevation) 
            AND NOT c.id = $id

        RETURN CASE
            WHEN c IS NOT NULL
                THEN false
            ELSE true
        END AS isUnique

    
    `


}