import { QueryHandler, IQueryHandler } from "@nestjs/cqrs";
import { Neo4jClient } from "@ns/neo4j";
import { TeamOptionsQuery } from "./team-options.query";

@QueryHandler(TeamOptionsQuery)
export class TeamOptionsQueryHandler
    implements IQueryHandler<TeamOptionsQuery, any[]>
{
    constructor(private readonly client: Neo4jClient) {}

    async execute(query: TeamOptionsQuery): Promise<any[]> {
        const queryResult = await this.client.read(this.query, {
            workpackageId: query.workpackageId,
        });
        const response: any[] =
            queryResult.records[0].get("options");
        return response;
    }

    query = `
        MATCH (a:Agent)
           WHERE NOT (a)-[*2]-(:Workpackage {id: $workpackageId})
        MATCH (r:Resource)<-[:IS]-(a)-[:IS]->(rt:ResourceType)
        WITH {
            id: a.id,
            resource: {
                id: r.id,
                name: r.name,
                color: r.color,
                costRate: {
                    default: r.costDefault,
                    overtime: r.costOvertime
                }
            },
            resourceType: {
                id: rt.id,
                name: rt.name,
                typeNo: rt.typeNo,
                abbrevation: rt.abbrevation,
                salesRate: {
                    default: rt.salesDefault,
                    overtime: rt.salesOvertime
                }
            }
        } AS option
        ORDER BY option.resource.name
        WITH collect(option) AS options
        RETURN options
   `;
}
