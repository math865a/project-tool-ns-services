import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { Neo4jClient } from "@ns/neo4j";
import { UsersViewQuery } from "./user-view.query";

@QueryHandler(UsersViewQuery)
export class UsersViewQueryHandler implements IQueryHandler {
    constructor(private client: Neo4jClient) {}

    async execute(query: UsersViewQuery): Promise<any> {
        const queryResult = await this.client.read(this.query, {
            uid: query.uid,
        });
        return queryResult.records.map((d) => d.get("row"));
    }

    query = `
        MATCH (u:User)
        WITH u ORDER BY u.name

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
    
        CALL {
            WITH u
            RETURN CASE
                WHEN u.uid = $uid
                    THEN true
                ELSE false
              
            END AS isSessionUser
        }

        CALL {
            WITH u
            OPTIONAL MATCH (u)-[:IN_ACCESS_GROUP]->(grp:AccessGroup)
            WITH collect(grp.id) AS accessGroups
            RETURN accessGroups
        }


        RETURN {
            uid: u.uid,
            name: u.name,
            email: u.email,
            phone: u.phone,
            color: u.color,
            isDeactivated: u.isDeactivated,
            lastSeen: u.lastSeen,
            isOnline: u.isOnline,
            isResource: isResource,
            isProjectManager: isProjectManager,
            isSessionUser: isSessionUser,
            accessGroups: accessGroups
        } AS row
    `;
}
