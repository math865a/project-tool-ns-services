import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Neo4jClient } from "@ns/neo4j";
import { ResourceRowsQuery } from './resource-rows.query';

@QueryHandler(ResourceRowsQuery)
export class ResourceRowsQueryHandler
    implements IQueryHandler<ResourceRowsQuery, any[]>
{
    constructor(private readonly client: Neo4jClient) {}

    async execute(): Promise<any[]> {
        const queryResult = await this.client.read(this.query);
        const response: any[] = queryResult.records.map((d) =>
            d.get('row')
        );
        return response;
    }

    query = `
        MATCH (resource:Resource)
        CALL {
            WITH resource
            MATCH (agent:Agent)-[:IS]->(resource)
            OPTIONAL MATCH (agent)-[:IS_ASSIGNED_TO]->(a:Allocation)
                WHERE (a.defaultMinutes > 0 OR a.overtimeMinutes > 0)
                AND NOT (a)<-[:HAS*4]-(:Workpackage)--(:BookingStage {name: "Ingen"})
            WITH a LIMIT 1
            RETURN CASE
                WHEN a IS NOT NULL
                    THEN true
                ELSE false
            END AS hasBookings
        }
        RETURN {
            id: resource.id,
            name: resource.name,
            color: resource.color,
            hasBookings: hasBookings
        } AS row
   `;
}
