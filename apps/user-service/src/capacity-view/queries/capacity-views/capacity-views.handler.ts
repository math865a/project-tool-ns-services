import { QueryHandler, IQueryHandler } from "@nestjs/cqrs";
import { Neo4jClient } from "@ns/neo4j";
import { CapacityViewsQuery } from "./capacity-views.query";

@QueryHandler(CapacityViewsQuery)
export class CapacityViewsQueryHandler
    implements IQueryHandler<CapacityViewsQuery, any[]>
{
    constructor(private readonly client: Neo4jClient) {}

    async execute({ uid }: CapacityViewsQuery): Promise<any[]> {
        const queryResult = await this.client.read(this.query, { uid: uid });
        return queryResult.records.map((d) => d.get("view"));
    }

    query = `
        MATCH (u:User)-[:HAS]-(view:CapacityBoardView)
            WHERE u.uid = $uid
        CALL {
            WITH view
            MATCH (view)--(r:Resource)
            RETURN collect(r.id) AS resources
        }
        CALL {
            WITH view
            MATCH (view)--(b:BookingStage)
            RETURN collect(b.name) AS bookingStages
        }
        CALL {
            WITH view, u
            OPTIONAL MATCH (u)-[rel:DEFAULT_CAPACITY_VIEW]->(view)
            RETURN CASE
                WHEN rel IS NOT NULL
                    THEN true
                ELSE false
            END AS isDefault
        }
        RETURN {
            id: view.id,
            name: view.name,
            isDefault: isDefault,
            resources: resources,
            bookingStages: bookingStages,
            order: view.order
        } AS view ORDER BY view.name
   `;
}
