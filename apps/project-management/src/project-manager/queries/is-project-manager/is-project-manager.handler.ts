import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { IsProjectManagerQuery } from "./is-project-manager.query";
import { Neo4jClient } from "@ns/neo4j";


@QueryHandler(IsProjectManagerQuery)
export class IsProjectManagerHandler implements IQueryHandler<IsProjectManagerQuery, boolean> {
    constructor(private client: Neo4jClient){}

    async execute(query: IsProjectManagerQuery): Promise<boolean> {
        const queryResult = await this.client.read(this.query, query);
        return queryResult.records[0].get("result");
    }

    query = `
        OPTIONAL MATCH (pm:ProjectManager)
            WHERE pm.id = $id
        RETURN CASE
            WHEN pm IS NULL THEN false
            ELSE true
        END AS result
    `;

}