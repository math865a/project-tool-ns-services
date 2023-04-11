import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { Neo4jClient } from "@ns/neo4j";
import { AccessGroupsViewQuery } from "./access-groups-view.query";

@QueryHandler(AccessGroupsViewQuery)
export class AccessGroupsViewQueryHandler
    implements IQueryHandler<AccessGroupsViewQuery>
{
    constructor(private client: Neo4jClient) {}

    async execute() {
        const queryResult = await this.client.read(this.query);
        return queryResult.records[0].get("result");
    }

    query = `
        CALL {
            MATCH (page:Page)
                WITH page ORDER BY page.sequence
            WITH collect(page) as pages, collect({
                name: page.name,
                url: page.url,
                icon: page.icon
            }) AS permissionColumns
            RETURN pages, permissionColumns
        }

        MATCH (accessGroup:AccessGroup)
        
        CALL {
            WITH accessGroup
            OPTIONAL MATCH (u:User)-[:IN_ACCESS_GROUP]->(accessGroup)
            WITH collect(u.uid) AS users
            RETURN users
        }

        CALL {
            WITH pages, accessGroup
            UNWIND pages AS page
                MATCH (accessGroup)-[permissionsRelation:HAS_PERMISSIONS]->(page)
                WITH page.name as pageName, permissionsRelation{.*} AS pagePermissions
                WITH [pageName, pagePermissions] AS pair
            WITH collect(pair) AS pairs
            WITH apoc.map.fromPairs(pairs) AS permissions
            RETURN permissions
        }

        CALL {
            WITH permissions, users, accessGroup
            RETURN {
                id: accessGroup.id,
                name: accessGroup.name,
                description: accessGroup.description,
                color: accessGroup.color,
                isAdmin: accessGroup.isAdmin,
                permissions: permissions,
                users: users
            } AS row
        }

        WITH collect(row) AS rows, permissionColumns
        RETURN {
            data: rows,
            permissionColumns: permissionColumns
        } AS result        
    `;
}
