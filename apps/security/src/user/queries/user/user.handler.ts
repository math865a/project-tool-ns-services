import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { Neo4jClient } from "@ns/neo4j";
import { UserQuery } from "./user.query";

@QueryHandler(UserQuery)
export class UserQueryHandler implements IQueryHandler<UserQuery> {
    constructor(private client: Neo4jClient) {}

    async execute(query: UserQuery): Promise<any> {
        if (!query.uid) return null;
        const queryResult = await this.client.read(this.query, {
            uid: query.uid,
        });
        return queryResult.records[0].get("result");
    }

    query = `
        MATCH (u:User)
            WHERE u.uid = $uid

        CALL {
            WITH u
            WITH labels(u) AS uLabels
            RETURN uLabels
        }


        CALL {
            WITH uLabels
            WITH "Resource" IN uLabels AS isResource
            RETURN isResource
        }

        CALL {
            WITH uLabels
            WITH "ProjectManager" IN uLabels AS isProjectManager
            RETURN isProjectManager
        }
        
        RETURN {
            uid: u.uid,
            name: u.name,
            email: u.email,
            color: u.color,
            isResource: isResource,
            isProjectManager: isProjectManager,
            isDeactivated: u.isDeactivated
        } AS result
    
    `;
}
