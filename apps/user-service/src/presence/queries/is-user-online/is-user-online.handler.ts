import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { IsUserOnlineQuery } from "./is-user-online.query";
import { Neo4jClient } from "@ns/neo4j";

@QueryHandler(IsUserOnlineQuery)
export class IsUserOnlineHandler implements IQueryHandler<IsUserOnlineQuery, boolean> {
    constructor(private client: Neo4jClient){}

    async execute(query: IsUserOnlineQuery): Promise<boolean> {
        const queryResult = await this.client.read(this.query, query);
        return queryResult.records[0].get("isOnline");
    }

    query = `
        MATCH (u:User)
            WHERE u.uid = $uid

        RETURN u.isOnline AS isOnline
    `;

}