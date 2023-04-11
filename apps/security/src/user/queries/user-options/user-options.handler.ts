import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { Neo4jClient } from "@ns/neo4j";
import { UserOptionsQuery } from "./user-options.query";

@QueryHandler(UserOptionsQuery)
export class UserOptionsQueryHandler
    implements IQueryHandler<UserOptionsQuery>
{
    constructor(private client: Neo4jClient) {}

    async execute(): Promise<any> {
        const queryResult = await this.client.read(this.query);
        return queryResult.records.map((record) => record.get("user"));
    }

    query = `
    MATCH (u:User)
    RETURN {
        uid: u.uid,
        name: u.name,
        color: u.color
    } as user
        ORDER BY user.name
`;
}
