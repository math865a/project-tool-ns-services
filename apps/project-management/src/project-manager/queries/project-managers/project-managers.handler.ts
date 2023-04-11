import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { ProjectManagersQuery } from "./project-managers.query";
import { Neo4jClient } from "@ns/neo4j";

@QueryHandler(ProjectManagersQuery)
export class ProjectManagersHandler
    implements IQueryHandler<ProjectManagersQuery>
{
    constructor(private client: Neo4jClient) {}

    async execute(query: ProjectManagersQuery) {
        const result = await this.client.read(this.query);
        return result.records.map((r) => r.get("projectManager"));
    }

    query = `
        MATCH (pm:ProjectManager)
            WHERE pm.name <> "Ingen"
        WITH pm ORDER BY pm.name

        RETURN {
            id: pm.id,
            name: pm.name,
            color: pm.color
        } AS projectManager
    
    `;
}
