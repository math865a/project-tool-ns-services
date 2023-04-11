import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { Neo4jClient } from "@ns/neo4j";
import { CapacityBatchQuery } from "./capacity-batch.query";

@QueryHandler(CapacityBatchQuery)
export class CapacityBatchQueryHandler
    implements IQueryHandler<CapacityBatchQuery, any[]>
{
    constructor(private readonly client: Neo4jClient) {}

    async execute({ dto }: CapacityBatchQuery): Promise<any[]> {
        const queryResult = await this.client.read(this.query, {
            ...dto,
            bookingStages: ["Soft", "Hard"],
        });
        const response: any[] = queryResult.records.map((d) =>
            d.get("capacity")
        );
        return response;
    }

    query = `
            UNWIND $bounds AS bound
            MATCH (resource:Resource)--(calendar:Calendar)-[cap:HAS_WORKDAY]-(day:CalendarDay)
                WHERE date(bound.ts) <= date(day.date) AND date(bound.tf) > date(day.date)
                AND resource.id IN $rows
            WITH resource, bound, round(sum(cap.capacity)/60,1) as capacityDuration

            CALL {
                WITH bound, resource
                OPTIONAL MATCH (resource)<-[:IS]-(:Agent)-[:IS_ASSIGNED_TO]->(a:Allocation)-[b:HAS_BOOKING]->(day:CalendarDay)
                    WHERE date(bound.ts) <= date(day.date) AND date(bound.tf) > date(day.date)
                    AND (a)<-[:HAS*4]-(:Workpackage)--(:BookingStage {name: "Soft"})
                RETURN round(sum(b.duration),1)/60 AS softBookedDuration
            }

            CALL {
                WITH bound, resource
                OPTIONAL MATCH (resource)<-[:IS]-(:Agent)-[:IS_ASSIGNED_TO]->(a:Allocation)-[b:HAS_BOOKING]->(day:CalendarDay)
                    WHERE bound.ts <= day.date AND bound.tf > day.date
                    AND (a)<-[:HAS*4]-(:Workpackage)--(:BookingStage {name: "Hard"})
                RETURN round(sum(b.duration),1)/60 AS hardBookedDuration
            }

            RETURN {
                id: apoc.text.join([resource.id, bound.ts],"-"),
                rowId: resource.id,
                stats: {
                    softBookedDuration: softBookedDuration,
                    hardBookedDuration: hardBookedDuration,
                    capacityDuration: capacityDuration
                },
                interval: {
                    ts: bound.ts,
                    tf: bound.tf
                },
                viewMode: $viewMode,
                rowMode: $rowMode
            } AS capacity
    `;
}
