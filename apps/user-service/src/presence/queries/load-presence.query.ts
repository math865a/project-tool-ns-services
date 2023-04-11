import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { Neo4jClient } from "@ns/neo4j";

export class LoadPresenceQuery {
    constructor(public readonly uid: string, public readonly except: boolean = false) {}
}

@QueryHandler(LoadPresenceQuery)
export class LoadPresenceQueryHandler
    implements IQueryHandler<LoadPresenceQuery, any[]>
{
    constructor(private readonly client: Neo4jClient) {}

    async execute(query: LoadPresenceQuery): Promise<any[]> {
        const { uid, except } = query;
        const queryResult = await this.client.read(except ? this.exceptQuery : this.query, { uid });
        return queryResult.records.map((d) => d.get("user"));
    }

    query = `
        MATCH (u:User)
            WHERE u.uid = $uid
            
        CALL {
            WITH u
            RETURN "Resource" IN labels(u) AS isResource  
        }

        CALL {
            WITH u
            RETURN "ProjectManager" IN labels(u) AS isProjectManager
        }

        RETURN {
            uid: u.uid,
            name: u.name,
            email: u.email,
            color: u.color,
            isProjectManager: isProjectManager,
            isResource: isResource
        } AS user
    `;

    exceptQuery = `
        MATCH (u:User)
            WHERE NOT u.uid = $uid
            AND u.isOnline = true      
            
        CALL {
            WITH u
            RETURN "Resource" IN labels(u) AS isResource  
        }

        CALL {
            WITH u
            RETURN "ProjectManager" IN labels(u) AS isProjectManager
        }

        RETURN {
            uid: u.uid,
            name: u.name,
            email: u.email,
            color: u.color,
            isProjectManager: isProjectManager,
            isResource: isResource
        } AS user
    `;
}
