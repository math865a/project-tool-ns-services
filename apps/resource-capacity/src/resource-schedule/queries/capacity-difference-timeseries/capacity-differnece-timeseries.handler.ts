import { QueryHandler, IQueryHandler } from "@nestjs/cqrs";
import { Neo4jClient } from "@ns/neo4j";
import { CapacityDifferenceTimeseriesQuery } from "./capacity-difference.query";

@QueryHandler(CapacityDifferenceTimeseriesQuery)
export class CapacityDifferenceTimeseriesQueryHandler
    implements
        IQueryHandler<
            CapacityDifferenceTimeseriesQuery,
            any[]
        >
{
    constructor(private readonly client: Neo4jClient) {}

    async execute(
        {instruction}: CapacityDifferenceTimeseriesQuery
    ): Promise<any[]> {
        const queryResult = await this.client.read(this.query, instruction);
        return queryResult.records.map((d) => d.get("result"));
    }

    query = `
        MATCH (r:Resource)--(c:Calendar)
        WHERE r.id = $resourceId

        UNWIND $periods AS period
        CALL {
            WITH period
                
            OPTIONAL MATCH (c)-[cap:HAS_WORKDAY]->(workday:CalendarDay)
                WHERE workday.week = period.week AND workday.year = period.year
                WITH sum(round(cap.capacity/60,2)) AS capacity, collect(workday) AS workdays
            RETURN workdays, capacity
        }

        CALL {
            WITH workdays, r
            UNWIND workdays AS workday
                OPTIONAL MATCH (workday)<-[b:HAS_BOOKING]-(a:Allocation)<-[:HAS*4]-(:Workpackage)--(bStage:BookingStage)
                    WHERE (a)<-[:IS_ASSIGNED_TO]-(:Agent)-[:IS]->(r)
                    AND bStage.name <> "Ingen"
                WITH round(sum(b.duration)/60,2) AS booked
            WITH sum(booked) As booked1
            RETURN booked1 AS booked
        }
        RETURN {
            week: period.week,
            year: period.year,
            booked: booked,
            capacity: capacity,
            diff: capacity-booked
        } AS result
    `;
}
