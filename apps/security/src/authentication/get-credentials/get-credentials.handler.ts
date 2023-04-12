import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { Neo4jClient } from "@ns/neo4j";
import { GetCredentialsQuery } from "./get-credentials.query"

@QueryHandler(GetCredentialsQuery)
export class GetCredentialsQueryHandler implements IQueryHandler<GetCredentialsQuery> {
    constructor(private client: Neo4jClient) {}

    async execute(query: GetCredentialsQuery): Promise<any> {
        if (!query.uid) return null;
        const queryResult = await this.client.read(this.query, {
            uid: query.uid,
        });
        return queryResult.records[0].get("result");
    }

    query = `
        MATCH (u:User)--(c:Credentials)
            WHERE u.uid = $uid
        RETURN {
            username: c.username,
            password: c.password
        } AS result

        
    
    `;
}
