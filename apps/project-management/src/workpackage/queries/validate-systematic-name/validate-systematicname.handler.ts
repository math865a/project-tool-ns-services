import { Neo4jClient } from "@ns/neo4j";
import { QueryHandler, IQueryHandler } from "@nestjs/cqrs";

import { ValidateSystematicNameQuery } from "./validate-systematicname.query";
import { FormErrorResponse } from "@ns/definitions";

@QueryHandler(ValidateSystematicNameQuery)
export class ValidateSystematicNameQueryHandler
    implements
        IQueryHandler<ValidateSystematicNameQuery, FormErrorResponse | string>
{
    constructor(private client: Neo4jClient) {}

    async execute({
        contractId,
        financialSourceId,
        serialNo,
        id = null,
    }: ValidateSystematicNameQuery): Promise<FormErrorResponse | string> {
        const queryResult = await this.client.read(this.validateQuery, {
            contractId: contractId,
            financialSourceId: financialSourceId,
            serialNo: serialNo,
            id: id,
        });
        const rec = queryResult.records[0];
        console.log(rec)
        if (rec.get("isUnique") === true) {
            return rec.get("systematicName") as string;
        }
        return new FormErrorResponse({
            message:
                "Der findes allerede en arbejdspakke med denne kontrakt, finanskilde og serienummer. Denne kombination skal være unik.",
        });
    }

    validateQuery = `
            MATCH (c:Contract {id: $contractId})
            MATCH (f:FinancialSource {id: $financialSourceId})
            WITH apoc.text.join([c.abbrevation, f.name, $serialNo], "-") as systematicName
            CALL {
                WITH systematicName
                OPTIONAL MATCH (w:Workpackage {systematicName: systematicName})
                    WHERE NOT w.id = $id
                WITH collect(w) as matches
                RETURN CASE 
                    WHEN size(matches) > 0 THEN false
                    ELSE true
                END AS isUnique
            }
            RETURN systematicName as systematicName, isUnique as isUnique
        `;
}
