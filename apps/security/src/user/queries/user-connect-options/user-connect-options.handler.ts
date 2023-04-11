import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { UserConnectOptionsQuery } from "./user-connect-options.query";
import { Neo4jClient } from "@ns/neo4j";

@QueryHandler(UserConnectOptionsQuery)
export class UserConnectOptionsHandler
    implements IQueryHandler<UserConnectOptionsQuery>
{
    constructor(private client: Neo4jClient) {}

    async execute(query: UserConnectOptionsQuery): Promise<any> {
        const queryResult = await this.client.read(this.query, query);
        return queryResult.records.map((d) => d.get("option"));
    }

    query = `
        MATCH (r:Resource)
            WHERE NOT "User" IN labels(r)
            AND NOT "DefaultProjectManager" IN labels(r)

        CALL {
            WITH r
            WITH "ProjectManager" IN labels(r) AS isProjectManager
            RETURN isProjectManager
        }

        CALL {
            WITH r
            WITH "Resource" IN labels(r) AS isResource
            RETURN isResource
        }
    
        RETURN {
            id: r.id,
            name: r.name,
            color: r.color,
            isProjectManager: isProjectManager,
            isResource: isResource
        } AS option ORDER BY option.name

    `;
}
