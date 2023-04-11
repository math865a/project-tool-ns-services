import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { ProjectManagerQuery } from "./project-manager.query";
import { Neo4jClient } from "@ns/neo4j";

@QueryHandler(ProjectManagerQuery)
export class ProjectManagerHandler
    implements IQueryHandler<ProjectManagerQuery>
{
    constructor(private client: Neo4jClient) {}

    async execute(query: ProjectManagerQuery): Promise<any> {
        const result = await this.client.read(this.query, { id: query.id });
        return result.records[0].get("projectManager")
    }

    query = `
        MATCH (pm:ProjectManager {id: $id})

        CALL {
            WITH pm
            RETURN CASE
                WHEN "Resource" IN labels(pm)
                    THEN true
                ELSE false
            END AS isResource
        }

        CALL {
            WITH pm
            RETURN CASE
                WHEN "User" IN labels(pm)
                    THEN true
                ELSE false
            END AS isUser
        }


        RETURN {
            id: pm.id,
            name: pm.name,
            color: pm.color,
            isResource: isResource,
            isUser: isUser
        } AS projectManager
    `;
}
